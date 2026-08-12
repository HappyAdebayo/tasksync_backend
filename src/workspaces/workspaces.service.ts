import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from './workspace.model';

@Injectable()
export class WorkspacesService {
   constructor(
    @InjectModel(Workspace)
    private readonly workspaceModel: typeof Workspace,
  ) {}

  async create(body: CreateWorkspaceDto) {
    return this.workspaceModel.create({
      name: body.name,
    });
  }

  async index(){
    return this.workspaceModel.findAll();
  }

}
