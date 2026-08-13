import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from './workspace.model';
import { Board } from '../boards/boards.model';

@Injectable()
export class WorkspacesService {
   constructor(
    @InjectModel(Workspace)
    private readonly workspaceModel: typeof Workspace,
    private readonly boardModel: typeof Board,
  ) {}

  async create(body: CreateWorkspaceDto, req) {
    return this.workspaceModel.create({
      name: body.name,
      userId: req.user.id
    });
  }

  async index(){
    return this.workspaceModel.findAll();
  }

  async findAll(id:string){
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

}
