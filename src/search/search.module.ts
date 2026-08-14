import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SequelizeModule } from '@nestjs/sequelize';


import { Board } from 'src/boards/boards.model';
import { Task } from 'src/tasks/tasks.model';
import { User } from 'src/users/users.model';
@Module({
   imports: [
    SequelizeModule.forFeature([
      Board,
      Task,
      User,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
