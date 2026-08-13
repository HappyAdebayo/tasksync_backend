import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notifications.model';
import { NotificationDto } from './dto/notifications.dto';

@Injectable()
export class NotificationsService {
    constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async create(body: NotificationDto, req) {
    return this.notificationModel.create({
      userId: req.user.id,
      title: body.title,
      message: body.message,
    });
  }

  async index(req){
    return this.notificationModel.findAll({
        where:{
            userId:req.user.id
        }
    })
  }
}
