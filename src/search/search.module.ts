import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SequelizeModule } from '@nestjs/sequelize';

import { Board } from 'src/boards/boards.model';
import { BoardList } from 'src/board_list/board_list.model';
import { Task } from 'src/tasks/tasks.model';
import { User } from 'src/users/users.model';
import { Workspace } from 'src/workspaces/workspace.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Board,
      BoardList,
      Task,
      User,
      Workspace,
      WorkspaceMember,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
