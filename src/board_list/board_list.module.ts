import { Module } from '@nestjs/common';
import { BoardListController } from './board_list.controller';
import { BoardListService } from './board_list.service';
import { BoardList } from './board_list.model';
import { Board } from 'src/boards/boards.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([BoardList, Board, WorkspaceMember]),
  ],
  controllers: [BoardListController],
  providers: [BoardListService],
  exports: [BoardListService],
})
export class BoardListModule {}
