import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Board } from 'src/boards/boards.model';
import { BoardList } from 'src/board_list/board_list.model';
import { Task } from 'src/tasks/tasks.model';
import { User } from 'src/users/users.model';
import { Workspace } from 'src/workspaces/workspace.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(BoardList)
    private readonly boardListModel: typeof BoardList,

    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Workspace)
    private readonly workspaceModel: typeof Workspace,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,
  ) {}

  async search(query: string, userId: string) {
    if (!query || !query.trim()) {
      return { boards: [], tasks: [], people: [] };
    }

    const pattern = `%${query.trim()}%`;

    // 1. Get all workspace IDs the current user belongs to
    const memberships = await this.workspaceMemberModel.findAll({
      where: { userId },
      attributes: ['workspaceId'],
    });
    const workspaceIds = memberships.map((m) => m.workspaceId);

    if (workspaceIds.length === 0) {
      return { boards: [], tasks: [], people: [] };
    }

    // 2. Find boards that belong to the user's workspaces
    const boards = await this.boardModel.findAll({
      where: {
        workspaceId: { [Op.in]: workspaceIds },
        name: { [Op.iLike]: pattern },
      },
      attributes: ['id', 'name', 'workspaceId'],
      limit: 8,
    });

    // 3. Find board IDs in those workspaces (to scope tasks)
    const allBoardsInWorkspaces = await this.boardModel.findAll({
      where: { workspaceId: { [Op.in]: workspaceIds } },
      attributes: ['id', 'workspaceId'],
    });
    const boardIdToWorkspaceId = Object.fromEntries(
      allBoardsInWorkspaces.map((b) => [b.id, b.workspaceId]),
    );
    const boardIds = Object.keys(boardIdToWorkspaceId);

    // 4. Find board lists for scoping tasks
    let tasks: any[] = [];
    if (boardIds.length > 0) {
      const listsInBoards = await this.boardListModel.findAll({
        where: { boardId: { [Op.in]: boardIds } },
        attributes: ['id', 'boardId'],
      });
      const listIdToBoardId = Object.fromEntries(
        listsInBoards.map((l) => [l.id, l.boardId]),
      );
      const listIds = Object.keys(listIdToBoardId);

      if (listIds.length > 0) {
        const rawTasks = await this.taskModel.findAll({
          where: {
            boardListId: { [Op.in]: listIds },
            name: { [Op.iLike]: pattern },
          },
          attributes: ['id', 'name', 'boardListId'],
          limit: 8,
        });

        tasks = rawTasks.map((t) => {
          const boardId = listIdToBoardId[t.boardListId];
          const workspaceId = boardIdToWorkspaceId[boardId] || null;
          return {
            id: t.id,
            name: t.name,
            boardListId: t.boardListId,
            boardId,
            workspaceId,
          };
        });
      }
    }

    // 5. Find people who are fellow members in any of the same workspaces
    const fellowMemberships = await this.workspaceMemberModel.findAll({
      where: { workspaceId: { [Op.in]: workspaceIds } },
      attributes: ['userId', 'workspaceId'],
    });

    // Group workspaceIds per userId
    const userWorkspacesMap: Record<string, string[]> = {};
    for (const m of fellowMemberships) {
      if (!userWorkspacesMap[m.userId]) userWorkspacesMap[m.userId] = [];
      userWorkspacesMap[m.userId].push(m.workspaceId);
    }

    const fellowUserIds = Object.keys(userWorkspacesMap);

    const rawPeople = await this.userModel.findAll({
      where: {
        id: { [Op.in]: fellowUserIds },
        [Op.or]: [
          { name: { [Op.iLike]: pattern } },
          { email: { [Op.iLike]: pattern } },
        ],
      },
      attributes: ['id', 'name', 'email'],
      limit: 8,
    });

    const people = rawPeople.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      // Return first shared workspace so the frontend can navigate to it
      workspaceId: (userWorkspacesMap[u.id] || []).find((wid) => workspaceIds.includes(wid)) || null,
    }));

    return {
      boards: boards.map((b) => ({
        id: b.id,
        name: b.name,
        workspaceId: b.workspaceId,
      })),
      tasks,
      people,
    };
  }
}