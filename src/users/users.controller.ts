import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

   @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.usersService.login(body);
  }
}
