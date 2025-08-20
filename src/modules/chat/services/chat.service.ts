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
    const { page = 1, limit = 10 } = pageable;
    return this.db.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        content: true,
        media: true,
        mediaType: true,
        createdAt: true,
        edited: true,
        user: { select: { id: true, firstname: true, lastname: true } },
        messageReceipt: {
          select: {
            status: true,
            user: { select: { firstname: true, lastname: true } },
          },
        },
      },
    });
  }
}
