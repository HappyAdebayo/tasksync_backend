import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from './notifications.model';
import { Invitation } from 'src/invitations/invitations.model';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Notification, Invitation]),
    RealtimeModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
