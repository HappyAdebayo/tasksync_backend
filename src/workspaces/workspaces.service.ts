import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Workspace } from './workspace.model';
import { Board } from '../boards/boards.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceModel: typeof Workspace,

    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(body: CreateWorkspaceDto, req) {
    return this.workspaceModel.create({
      name: body.name,
      userId: req.user.id,
    });
  }

  async index() {
    return this.workspaceModel.findAll({
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
  }

  async findAllWorkspaceBoards(id:string){
    let workspace= await this.workspaceModel.findOne({
      where :{
        id:id,
      }
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

  async delete(id: string) {
    const workspace = await this.workspaceModel.findOne({
      where: {
        id,
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    await workspace.destroy();

    return {
      message: 'Workspace deleted successfully',
    };
  }

}
