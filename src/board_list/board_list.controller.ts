import { Controller, Post, Body, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { BoardListService } from './board_list.service';
import { CreateBoardListDto, UpdateBoardListDto } from './dto/board_list.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('board-list')
export class BoardListController {
    constructor(
    private readonly boardListsService: BoardListService,
  ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body:CreateBoardListDto){
       return this.boardListsService.create(body)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id:string){
       return this.boardListsService.delete(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id:string, @Body() body: UpdateBoardListDto,){
        return this.boardListsService.update(id, body)
    }
}
