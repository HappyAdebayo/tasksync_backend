import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Board } from 'src/boards/boards.model';
import { Task } from 'src/tasks/tasks.model';
import { User } from 'src/users/users.model';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Board)
    private readonly boardModel: typeof Board,

    @InjectModel(Task)
    private readonly taskModel: typeof Task,

    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async search(query: string) {
    if (!query || !query.trim()) {
      return {
        boards: [],
        tasks: [],
        people: [],
      };
    }

    const search = `%${query.trim()}%`;

    const [boards, tasks, people] = await Promise.all([
      this.boardModel.findAll({
        where: {
          name: {
            [Op.iLike]: search,
          },
        },
        limit: 5,
      }),

      this.taskModel.findAll({
        where: {
          name: {
            [Op.iLike]: search,
          },
        },
        limit: 5,
      }),

      this.userModel.findAll({
        where: {
          name: {
            [Op.iLike]: search,
          },
        },
        attributes: ['id', 'name', 'email'],
        limit: 5,
      }),
    ]);

    return {
      boards,
      tasks,
      people,
    };
  }
}