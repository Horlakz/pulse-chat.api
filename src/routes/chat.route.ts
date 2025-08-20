import { PrismaService } from "@/config/prisma";
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

  chatRouter.post("/rooms", roomController.createRoom);
  chatRouter.get("/rooms/my", roomController.myRooms);
  chatRouter.get("/rooms/public", roomController.listPublicRooms);
  chatRouter.get("/rooms/:roomId/members", roomController.listRoomMembers);
  chatRouter.post("/rooms/:roomId/join", roomController.joinRoom);
  chatRouter.post("/rooms/:roomId/leave", roomController.leaveRoom);

  chatRouter.post("/:roomId/messages", chatController.sendMessage);
  chatRouter.get("/:roomId/messages", chatController.listMessages);

  return chatRouter;
}
