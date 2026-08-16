import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { BoardList } from 'src/board_list/board_list.model';
import { Board } from 'src/boards/boards.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task, BoardList, Board, WorkspaceMember]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
