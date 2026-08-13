import { IsNotEmpty, IsOptional, IsString, isUUID, IsUUID } from "class-validator";

export class CreateBoardDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    color!: string;

    @IsString()
    @IsOptional()
    description!: string;

    @IsUUID()
    @IsNotEmpty()
    workspaceId!: string;
}
