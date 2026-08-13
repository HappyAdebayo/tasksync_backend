import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Board } from './boards.model';

@Module({

  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule {}
