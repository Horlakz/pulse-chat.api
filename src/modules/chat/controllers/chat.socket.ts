import { Server, Socket } from "socket.io";
import { BaseSocketController } from "../../../utilities/base-socket";
import { ChatService } from "../services/chat.service";

export class ChatSocketController extends BaseSocketController {
  private io: Server;

  constructor(
    io: Server,
    socket: Socket,
    private readonly chatService: ChatService
  ) {
    super(socket);
    this.io = io;
    this.registerEvents();
  }

  private registerEvents() {
    this.on<{ roomId: string; content: string }>(
      "chat:message",
      async (payload) => {
        const user = (this.socket as any).user;
        if (!user) throw new Error("Unauthorized");

        const message = await this.chatService.sendMessage(
          user.sub,
          payload.roomId,
          { content: payload.content }
        );

        this.socket.join(payload.roomId);
        this.io.to(payload.roomId).emit("chat:message", message);
      }
    );

    this.on<{ roomId: string }>("chat:typing", async (payload) => {
      const user = (this.socket as any).user;
      if (!user) throw new Error("Unauthorized");

      const userDetails = await this.chatService.getUserDetails(user.sub);

      this.socket.join(payload.roomId);
      this.io.to(payload.roomId).emit("chat:typing", userDetails);
    });

    this.on<{ roomId: string }>("chat:join", async (payload) => {
      const user = (this.socket as any).user;
      if (!user) throw new Error("Unauthorized");

      await this.chatService.markMessagesAsRead(user.sub, payload.roomId);

      this.socket.join(payload.roomId);
      this.io.to(payload.roomId).emit("chat:user_joined", { userId: user.sub });
    });
  }
}
