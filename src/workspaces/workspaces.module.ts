import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './workspace.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from 'src/boards/boards.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Module({
  imports:[
    SequelizeModule.forFeature([Workspace, Board, WorkspaceMember]),
  ],
  controllers: [WorkspacesController],
  providers: [WorkspacesService]
})
export class WorkspacesModule {}
