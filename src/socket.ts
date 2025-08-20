import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

import { PrismaService } from "./config/prisma";
import { ChatSocketController } from "./modules/chat/controllers/chat.socket";
import { ChatService } from "./modules/chat/services/chat.service";
import { JwtUtils } from "./utilities/jwt.utility";

export function initSockets(server: HttpServer, path: string = "/ws") {
  const io = new Server(server, {
    path,
    cors: { origin: "*" },
  });

  const db = new PrismaService();

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers["authorization"];

    if (!token) return next(new Error("Unauthorized"));

    try {
      const payload = JwtUtils.verify(token, "access");
      (socket as any).user = payload;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const chatService = new ChatService(db);
    const user = (socket as any).user;
    if (!user) throw new Error("Unauthorized");

    chatService.updateUserPresence((socket as any).user.sub, "online");
    chatService.deliverAllUnacknowledgedMessages((socket as any).user.sub);

    console.log("Socket connected:", socket.id);
    new ChatSocketController(io, socket, chatService);

    socket.on("disconnect", () => {
      chatService.updateUserPresence((socket as any).user.sub, "offline");
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}
