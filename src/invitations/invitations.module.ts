import { Module } from '@nestjs/common';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Invitation } from './invitations.model';
@Module({
  imports:[
        SequelizeModule.forFeature([Invitation]),
      ],
  controllers: [InvitationsController],
  providers: [InvitationsService]
})
export class InvitationsModule {}
