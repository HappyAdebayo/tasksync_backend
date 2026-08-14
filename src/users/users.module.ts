import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports:[
        SequelizeModule.forFeature([User]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') ,
            signOptions: {
              expiresIn: '7d',
            },
          }),
        }),
      ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
