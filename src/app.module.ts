import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { BoardsModule } from './boards/boards.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { BoardService } from './board/board.service';
import { WorksModule } from './works/works.module';
import { BoardListModule } from './board_list/board_list.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadModels: true,
        synchronize: false,
      }),
    }),

    BoardsModule,

    WorkspacesModule,

    WorksModule,

    BoardListModule,

    NotificationsModule,

    UsersModule,

    AuthModule,
  ],
  providers: [BoardService],
})
export class AppModule {}