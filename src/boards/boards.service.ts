import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './boards.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardList } from 'src/board_list/board_list.model';

@Injectable()
export class BoardsService {
    constructor(
        @InjectModel(Board)
        private readonly boardModel: typeof Board,

        @InjectModel(BoardList)
        private readonly boardListModel: typeof BoardList,
    ){}

    async create(body: CreateBoardDto){
      return this.boardModel.create({
        name: body.name,
        description: body.description,
        color: body.color,
        workspaceId: body.workspaceId
      })
    }

    async index(){
        return this.boardModel.findAll();
    }
    async findAll(id:string){
        let board= await this.boardModel.findOne({
          where :{
              id:id,
            }
        });

        if (!board) {
            throw new NotFoundException('Workspace not found');
        } 
        
        return this.boardListModel.findAll({
        where: {
          boardId: board.id,
        }
        })
    }

    async delete(id: string) {
        const board = await this.boardModel.findOne({
          where: {
            id,
          },
        });

        if (!board) {
          throw new NotFoundException('Board not found');
        }

        await board.destroy();

        return {
          message: 'Board deleted successfully',
        };
      }
}
