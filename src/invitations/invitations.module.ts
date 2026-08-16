import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invitation } from './invitations.model';
import { Notification } from 'src/notifications/notifications.model';
import { User } from 'src/users/users.model';
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Invitation, Notification, User, WorkspaceMember]),
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
