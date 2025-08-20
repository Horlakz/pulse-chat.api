import type { Request, Response } from "express";

import { BaseResponse } from "@/utilities/base-reponse";
import { IChatPageable } from "../chat.interface";
import { ChatService } from "../services/chat.service";

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  sendMessage = async (req: Request<{ roomId: string }>, res: Response) => {
    await this.chatService.sendMessage(
      req.user.sub as string,
      req.params.roomId,
      req.body
    );
    res.json(BaseResponse.success(null));
  };

  listMessages = async (
    req: Request<{ roomId: string }, {}, {}, IChatPageable>,
    res: Response
  ) => {
    const messages = await this.chatService.listMessages(
      req.params.roomId,
      req.query
    );
    res.json(BaseResponse.success(messages));
  };
}
