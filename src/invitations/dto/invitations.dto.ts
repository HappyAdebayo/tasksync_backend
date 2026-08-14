import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  workspaceId!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsEmail()
  email!: string;
}