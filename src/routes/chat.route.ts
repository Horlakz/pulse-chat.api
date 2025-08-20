import { PrismaService } from "@/config/prisma";
import { validateDto } from "@/middleware/validator-dto";
import {
  ChatParamDto,
  MessageCreateDto,
  RoomCreateDto,
} from "@/modules/chat/chat.dto";
import { ChatController } from "@/modules/chat/controllers/chat.controller";
import { RoomController } from "@/modules/chat/controllers/room.controller";
import { ChatService } from "@/modules/chat/services/chat.service";
import { RoomService } from "@/modules/chat/services/room.service";
import { Router } from "express";

export default function initChatRouter(db: PrismaService) {
  const roomService = new RoomService(db);
  const chatService = new ChatService(db);

  const roomController = new RoomController(roomService);
  const chatController = new ChatController(chatService);

  const chatRouter = Router();

  chatRouter.post(
    "/rooms",
    validateDto(RoomCreateDto),
    roomController.createRoom
  );
  chatRouter.get("/rooms", roomController.myRooms);
  chatRouter.get("/rooms/public", roomController.listPublicRooms);
  chatRouter.get(
    "/rooms/:roomId/members",
    validateDto(ChatParamDto, "params"),
    roomController.listRoomMembers
  );
  chatRouter.post(
    "/rooms/:roomId/join",
    validateDto(ChatParamDto, "params"),
    roomController.joinRoom
  );
  chatRouter.post(
    "/rooms/:roomId/leave",
    validateDto(ChatParamDto, "params"),
    roomController.leaveRoom
  );

  chatRouter.post(
    "/:roomId/messages",
    validateDto(ChatParamDto, "params"),
    validateDto(MessageCreateDto),
    chatController.sendMessage
  );
  chatRouter.get(
    "/:roomId/messages",
    validateDto(ChatParamDto, "params"),
    // validateDto(ChatPageableDto, "query"),
    chatController.listMessages
  );

  return chatRouter;
}
