import { MessageMediaType, RoomType } from "@prisma/client";

import { IPageable } from "../interface";

export interface IRoomCreate {
  name: string;
  type: RoomType;
}

export interface IMessageCreate {
  content: string;
  media?: string;
  mediaType?: MessageMediaType;
}

export interface IMessageUpdate {
  content: string;
}

export interface IChatPageable extends IPageable {}
