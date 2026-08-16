import { Controller, Post, Body, Get, Param, UseGuards, Delete, Request } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateBoardDto, @Request() req) {
    return this.boardsService.create(body, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  index() {
    return this.boardsService.index();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.boardsService.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBoard(@Param('id') id: string, @Request() req) {
    return this.boardsService.delete(id, req.user?.id);
  }
}
