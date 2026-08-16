import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  invitationId!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}