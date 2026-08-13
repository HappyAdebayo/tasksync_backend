import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() body:CreateBoardDto){
          return this.boardsService.create(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    index(){
        return this.boardsService.index();
    }
    
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findAll(@Param('id') id:string){
        return this.boardsService.findAll(id)
    }

}
