import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Workspace } from './workspace.model';
import { Board } from '../boards/boards.model';
import { Sequelize } from 'sequelize-typescript';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceModel: typeof Workspace,

    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(body: CreateWorkspaceDto, req) {
    return this.sequelize.transaction(async (transaction) => {
      const workspace = await this.workspaceModel.create(
        {
          name: body.name,
        },
        {
          transaction,
        },
      );

      await this.workspaceMemberModel.create(
        {
          workspaceId: workspace.id,
          userId: req.user.id,
          role: 'owner',
        },
        {
          transaction,
        },
      );

      return {
        ...workspace.get({ plain: true }),
        role: 'owner',
      };
    });
  }

  async index(req) {
    const workspaces = await this.workspaceModel.findAll({
      include: [
        {
          model: this.workspaceMemberModel,
          where: {
            userId: req.user.id,
          },
          attributes: ['role'],
        },
      ],
      attributes: {
        include: [
          [
            this.sequelize.literal(`(
              SELECT COUNT(*)
              FROM "boards"
              WHERE "boards"."workspaceId" = "Workspace"."id"
            )`),
            'boardCount',
          ],
        ],
      },
    });

    return workspaces.map((ws: any) => {
      const plain = ws.get({ plain: true });
      const role = plain.members?.[0]?.role || 'viewer';
      return {
        ...plain,
        role,
      };
    });
  }

  async findAllWorkspaceBoards(id: string) {
    const workspace = await this.workspaceModel.findOne({
      where: {
        id,
      },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return this.boardModel.findAll({
      where: {
        workspaceId: workspace.id,
      },
    });
  }

  async delete(id: string, req) {
    const workspace = await this.workspaceModel.findOne({
      where: {
        id,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const owner = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId: id,
        userId: req.user.id,
        role: 'owner',
      },
    });

    if (!owner) {
      throw new ForbiddenException(
        'Only the workspace owner can delete this workspace',
      );
    }

    await workspace.destroy();

    return {
      message: 'Workspace deleted successfully',
    };
  }
}
