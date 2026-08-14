import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async create(body: CreateTaskDto) {
    return this.taskModel.create({
      name: body.name,
      boardListId: body.boardListId,
      position: body.position ?? 0,
    });
  }

  async update(id: string, body: UpdateTaskDto) {
    const task = await this.taskModel.findOne({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await task.update({
      name: body.name,
      boardListId: body.boardListId,
      position: body.position,
    });

    return task;
  }

  async delete(id: string) {
    const task = await this.taskModel.findOne({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await task.destroy();

    return {
      message: 'Task deleted successfully',
    };
  }
}