import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notifications.model';

@Module({
  imports:[
      SequelizeModule.forFeature([Notification]),
    ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
