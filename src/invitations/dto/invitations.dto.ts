import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  workspaceId!: string;

  @IsEmail()
  email!: string;
}