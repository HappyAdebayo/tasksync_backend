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
import { WorkspaceMember } from 'src/workspace_members/workspace_member.model';
import { CreateInvitationDto } from './dto/invitations.dto';
import * as crypto from 'crypto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,
    
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(WorkspaceMember)
    private readonly workspaceMemberModel: typeof WorkspaceMember,

    @InjectConnection()
    private readonly sequelize: Sequelize,

    private readonly notificationsService: NotificationsService,
  ) {}

  async invite(body: CreateInvitationDto, req: any) {
  const invitedUser = await this.userModel.findOne({
    where: {
      email: body.email,
    },
  });
  
  if (!invitedUser) {
    throw new NotFoundException(
      'User not found',
    );
  }

  if (invitedUser?.id === req.user.id) {
    throw new BadRequestException(
      'You cannot invite yourself',
    );
  }

  // If the user exists, check if they are already a member
  if (invitedUser) {
    const existingMember = await this.workspaceMemberModel.findOne({
      where: {
        workspaceId: body.workspaceId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        'This user is already a member of the workspace',
      );
    }
  }

  // Check if there is already a pending invitation
  const existingInvitation = await this.invitationModel.findOne({
    where: {
      workspaceId: body.workspaceId,
      email: body.email,
      status: 'pending',
    },
  });

  if (existingInvitation) {
    throw new BadRequestException(
      'An invitation has already been sent to this user',
    );
  }

  const token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return this.sequelize.transaction(async (transaction) => {
    // Create invitation
    const invitation = await this.invitationModel.create(
      {
        workspaceId: body.workspaceId,
        email: body.email,
        token,
        status: 'pending',
        expiresAt,
        invitedBy: req.user.id,
        role: body.role
      },
      {
        transaction,
      },
    );

    if (invitedUser) {
      await this.notificationsService.create(
    {
      userId: invitedUser.id,
      invitationId: invitation.id,
      title: 'You are invited into a workspace',
      message:
        'You have been invited to join a workspace. Please check your notifications to respond.',
    },
    transaction,
  );
    }

    return invitation;
  });
}

  async accept(token: string, req: any) {
    return this.sequelize.transaction(async (transaction) => {
      const invitation = await this.invitationModel.findOne({
        where: {
          token,
        },
        transaction,
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
        await invitation.update(
          {
            status: 'expired',
          },
          { transaction },
        );

        throw new BadRequestException('Invitation has expired');
      }

      // Make sure the logged-in user is the person invited
      const invitedUser = await this.userModel.findOne({
        where: {
          id: req.user.id,
          email: invitation.email,
        },
        transaction,
      });

      if (!invitedUser) {
        throw new BadRequestException(
          'This invitation was not sent to your account',
        );
      }

      // Make the user a member of the workspace
      await this.workspaceMemberModel.create(
        {
          workspaceId: invitation.workspaceId,
          userId: req.user.id,
          role: invitation.role,
        },
        { transaction },
      );

      // Mark invitation as accepted
      await invitation.update(
        {
          status: 'accepted',
        },
        { transaction },
      );

      return {
        message: 'Invitation accepted successfully',
      };
    });
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

    await invitation.destroy();

    return {
      message: 'Invitation declined successfully',
    };
  }

  async index(req){
    return this.invitationModel.findAll({
      where:{
        userId: req.user.id
      }
    })
  }
}