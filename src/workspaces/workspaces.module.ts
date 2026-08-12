import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './workspace.model';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports:[
    SequelizeModule.forFeature([Workspace]),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
