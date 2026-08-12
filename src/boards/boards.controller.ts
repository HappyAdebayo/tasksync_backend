import { Controller, Post } from '@nestjs/common';

@Controller('boards')
export class BoardsController {
    @Post()
    create(){
          return { message: 'Board created successfully' };
    }
}
