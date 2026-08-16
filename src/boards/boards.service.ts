import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Board } from './boards.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardList } from 'src/board_list/board_list.model';
import { Task } from 'src/tasks/tasks.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(BoardList)
    private readonly boardListModel: typeof BoardList,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,
  ) {}

  async create(body: CreateBoardDto, userId?: string) {
    if (userId) {
      const member = await this.workspaceMemberModel.findOne({
        where: {
          workspaceId: body.workspaceId,
          userId,
        },
      });

      if (!member) {
        throw new ForbiddenException('You are not a member of this workspace');
      }

      if (member.role !== 'owner' && member.role !== 'editor') {
        throw new ForbiddenException('Only workspace owners and editors can create boards. Viewers have read-only access.');
      }
    }

    return this.boardModel.create({
      name: body.name,
      description: body.description,
      color: body.color,
      workspaceId: body.workspaceId,
    });
  }

  async index() {
    return this.boardModel.findAll();
  }

  async findAll(id: string) {
    const board = await this.boardModel.findOne({
      where: {
        id: id,
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return this.boardListModel.findAll({
      where: {
        boardId: board.id,
      },
      include: [
        {
          model: Task,
          required: false,
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async delete(id: string, userId?: string) {
    const board = await this.boardModel.findOne({
      where: {
        id,
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    if (userId) {
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
        throw new ForbiddenException('Only workspace owners and editors can delete boards. Viewers have read-only access.');
      }
    }

    await board.destroy();

    return {
      message: 'Board deleted successfully',
    };
  }
}
