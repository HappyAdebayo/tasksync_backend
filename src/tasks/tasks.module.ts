import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks.model';

@Module({
    imports:[
        SequelizeModule.forFeature([Task]),
      ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
