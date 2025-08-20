import { PrismaService } from "@/config/prisma";
import { IChatPageable, IMessageCreate } from "../chat.interface";

export class ChatService {
  constructor(private readonly db: PrismaService) {}

  async sendMessage(userId: string, roomId: string, data: IMessageCreate) {
    return await this.db.message.create({
      data: { senderId: userId, roomId, ...data },
      select: {
        id: true,
        content: true,
        media: true,
        mediaType: true,
        createdAt: true,
      },
    });
  }

  async listMessages(roomId: string, pageable: IChatPageable) {
    return this.db.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      skip: (pageable.page - 1) * pageable.limit,
      take: pageable.limit,
      select: {
        id: true,
        content: true,
        media: true,
        mediaType: true,
        createdAt: true,
        user: { select: { id: true, firstname: true, lastname: true } },
      },
    });
  }
}
