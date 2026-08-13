import { Module } from '@nestjs/common';
import { BoardListController } from './board_list.controller';
import { BoardListService } from './board_list.service';
import { BoardList } from './board_list.model'
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports:[
      SequelizeModule.forFeature([BoardList]),
    ],
  controllers: [BoardListController],
  providers: [BoardListService]
})
export class BoardListModule {}
