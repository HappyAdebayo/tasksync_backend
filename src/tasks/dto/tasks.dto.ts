import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsNotEmpty()
  boardListId!: string;

  @IsInt()
  @IsOptional()
  position!: number;
}


export class UpdateTaskDto extends PartialType(CreateTaskDto) {}