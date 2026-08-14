import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notifications.model';
import { Invitation } from 'src/invitations/invitations.model';

@Module({
  imports:[
      SequelizeModule.forFeature([Notification, Invitation]),
    ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
