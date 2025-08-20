import { RoomType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RoomCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;
}

export class MessageCreateDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatParamDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class ChatPageableDto {
  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}
