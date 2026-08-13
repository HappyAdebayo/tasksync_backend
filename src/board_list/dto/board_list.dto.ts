import { IsString, IsNotEmpty, IsUUID, IsOptional } from "class-validator";

export class CreateBoardListDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsUUID()
    @IsNotEmpty()
    boardId!: string;
}

export class UpdateBoardListDto {
  @IsString()
  @IsOptional()
  name?: string;
}
