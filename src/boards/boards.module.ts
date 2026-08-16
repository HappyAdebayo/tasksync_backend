import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './boards.model';
import { BoardList } from 'src/board_list/board_list.model';
import { Task } from 'src/tasks/tasks.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Board, BoardList, Task]),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
