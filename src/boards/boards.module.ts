import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './boards.model';
import { BoardList } from 'src/board_list/board_list.model';

@Module({
  imports:[
        SequelizeModule.forFeature([Board,BoardList,]),
      ],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {}
