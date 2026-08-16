import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateBoardListDto, UpdateBoardListDto } from './dto/board_list.dto';
import { BoardList } from './board_list.model';
import { Board } from 'src/boards/boards.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BoardListService {
  constructor(
    @InjectModel(BoardList)
    private readonly boardListModel: typeof BoardList,

    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,
  ) {}

  private async verifyBoardPermission(boardId: string, userId?: string) {
    if (!userId) return;

    const board = await this.boardModel.findOne({
      where: { id: boardId },
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
      throw new ForbiddenException('Only workspace owners and editors can modify board lists. Viewers have read-only access.');
    }
  }

  async create(body: CreateBoardListDto, userId?: string) {
    await this.verifyBoardPermission(body.boardId, userId);

    return this.boardListModel.create({
      name: body.name,
      color: body.color,
      boardId: body.boardId,
    });
  }

  async delete(id: string, userId?: string) {
    const boardList = await this.boardListModel.findOne({
      where: {
        id,
      },
    });

    if (!boardList) {
      throw new NotFoundException('Board list not found');
    }

    await this.verifyBoardPermission(boardList.boardId, userId);

    await boardList.destroy();

    return {
      message: 'Board list deleted successfully',
    };
  }

  async update(id: string, body: UpdateBoardListDto, userId?: string) {
    const boardList = await this.boardListModel.findOne({
      where: {
        id,
      },
    });

    if (!boardList) {
      throw new NotFoundException('Board list not found');
    }

    await this.verifyBoardPermission(boardList.boardId, userId);

    await boardList.update({
      name: body.name,
    });

    return boardList;
  }
}
