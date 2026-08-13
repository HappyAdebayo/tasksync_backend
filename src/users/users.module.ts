import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[
        SequelizeModule.forFeature([User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '7d',
          },
        }),
      ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
