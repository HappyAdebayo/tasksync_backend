import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notifications.model';
import { NotificationDto } from './dto/notifications.dto';
import { Invitation } from 'src/invitations/invitations.model';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';
import { Transaction } from 'sequelize';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async create(body: NotificationDto, transaction?: Transaction) {
    const notifications = await this.notificationModel.create(
      {
        userId: body.userId,
        invitationId: body.invitationId,
        title: body.title,
        message: body.message,
      },
      {
        transaction,
      },
    );

    const emitEvent = () => {
      if (this.realtimeGateway) {
        console.log(`[Realtime] Emitting notification to user:${notifications.userId}`);
        this.realtimeGateway.emitToUser(notifications.userId, 'notification:new', notifications);
        this.realtimeGateway.emitToUser(notifications.userId, 'notification', notifications);
      }
    };

    if (transaction) {
      transaction.afterCommit(() => {
        emitEvent();
      });
    } else {
      emitEvent();
    }

    return notifications;
  }

  async index(req: any) {
    return this.notificationModel.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Invitation,
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
