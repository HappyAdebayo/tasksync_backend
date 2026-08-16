import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { Task } from './tasks.model';
import { BoardList } from 'src/board_list/board_list.model';
import { Board } from 'src/boards/boards.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(BoardList)
    private readonly boardListModel: typeof BoardList,

    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,
  ) {}

  private async verifyBoardListPermission(boardListId: string, userId?: string) {
    if (!userId) return;

    const list = await this.boardListModel.findOne({
      where: { id: boardListId },
    });
    if (!list) {
      throw new NotFoundException('Board list not found');
    }

    const board = await this.boardModel.findOne({
      where: { id: list.boardId },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const member = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId: board.workspaceId,
        userId,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this workspace');
    }

    if (member.role !== 'owner' && member.role !== 'editor') {
      throw new ForbiddenException('Only workspace owners and editors can modify tasks. Viewers have read-only access.');
    }
  }

  async create(body: CreateTaskDto, userId?: string) {
    await this.verifyBoardListPermission(body.boardListId, userId);

    return this.taskModel.create({
      name: body.name,
      boardListId: body.boardListId,
      position: body.position || 0,
    });
  }

  async update(id: string, body: UpdateTaskDto, userId?: string) {
    const task = await this.taskModel.findOne({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.verifyBoardListPermission(task.boardListId, userId);

    if (body.boardListId && body.boardListId !== task.boardListId) {
      await this.verifyBoardListPermission(body.boardListId, userId);
    }

    await task.update({
      name: body.name,
      boardListId: body.boardListId,
      position: body.position,
    });

    return task;
  }

  async delete(id: string, userId?: string) {
    const task = await this.taskModel.findOne({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.verifyBoardListPermission(task.boardListId, userId);

    await task.destroy();

    return {
      message: 'Task deleted successfully',
    };
  }
}