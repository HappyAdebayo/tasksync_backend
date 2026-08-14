import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardListDto, UpdateBoardListDto } from './dto/board_list.dto';
import { BoardList } from './board_list.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class BoardListService {
        constructor(
            @InjectModel(BoardList)
            private readonly boardListModel: typeof BoardList,
        ){}
    
        async create(body: CreateBoardListDto){
          return this.boardListModel.create({
            name: body.name,
            color: body.color,
            boardId: body.boardId
          })
        }

        async delete(id: string) {
            const boardList = await this.boardListModel.findOne({
                where: {
                    id,
                },
            });

            if (!boardList) {
                throw new NotFoundException('Board list not found');
            }

            await boardList.destroy();

            return {
                 message: 'Board list deleted successfully',
            };
        }

        async update(id: string, body: UpdateBoardListDto) {
            const boardList = await this.boardListModel.findOne({
                where: {
                    id,
                },
            });

            if (!boardList) {
                throw new NotFoundException('Board list not found');
            }

            await boardList.update({
                name: body.name,
            });

             return boardList;
  }
}
