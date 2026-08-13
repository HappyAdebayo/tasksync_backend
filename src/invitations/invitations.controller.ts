import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Req
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/invitations.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  invite(@Body() body: CreateInvitationDto, @Req() req:Request ){
    return this.invitationsService.invite(body, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  accept(@Param('token') token: string) {
    return this.invitationsService.accept(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/decline')
  decline(@Param('token') token: string) {
    return this.invitationsService.decline(token);
  }
}