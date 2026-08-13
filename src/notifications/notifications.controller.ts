import { Body, Controller,Post,Get,UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/notifications.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('notifications')
export class NotificationsController {
        constructor(private readonly notificationService: NotificationsService) {}

        @UseGuards(JwtAuthGuard)
        @Post()
        create(@Body() body: NotificationDto, @Req() req:Request){
             return this.notificationService.create(body,req)
        }
       
        @UseGuards(JwtAuthGuard)
        @Get()
        index(@Req() req:Request){
             return this.notificationService.index(req)
        }
    
}
