import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NotificationDto {

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}