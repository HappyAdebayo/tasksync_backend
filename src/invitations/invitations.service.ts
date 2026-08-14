import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Invitation } from './invitations.model';
import { Notification } from 'src/notifications/notifications.model';
import { User } from 'src/users/users.model';
import { CreateInvitationDto } from './dto/invitations.dto';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,
    
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async invite(body: CreateInvitationDto, req) {
    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitedUser= await this.userModel.findOne({
      where:{
        email:body.email
      }
    })
    
    return this.sequelize.transaction(async (transaction) => {
    const invitation = await this.invitationModel.create({
      workspaceId: body.workspaceId,
      email: body.email,
      token,
      status: 'pending',
      expiresAt,
      invitedBy : req.user.id
    });

    if (invitedUser) {
          await this.notificationModel.create(
            {
              userId: invitedUser.id,
              title: 'You are invited into a workspace',
              message:
                'You have been invited to join a workspace. Please check your email for the invitation link.',
            },
            {
              transaction,
            },
          );
        }

    return invitation;
  });
  }

  async accept(token: string) {
    const invitation = await this.invitationModel.findOne({
      where: {
        token,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        'This invitation is no longer pending',
      );
    }

    if (new Date() > invitation.expiresAt) {
      await invitation.update({
        status: 'expired',
      });

      throw new BadRequestException('Invitation has expired');
    }

    await invitation.update({
      status: 'accepted',
    });

    return {
      message: 'Invitation accepted successfully',
    };
  }

  async decline(token: string) {
    const invitation = await this.invitationModel.findOne({
      where: {
        token,
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        'This invitation is no longer pending',
      );
    }

    await invitation.update({
      status: 'rejected',
    });

    return {
      message: 'Invitation declined successfully',
    };
  }
}