import { PrismaService } from "@/config/prisma";
import redis from "@/config/redis";
import { IChatPageable, IMessageCreate } from "../chat.interface";

export class ChatService {
  constructor(private readonly db: PrismaService) {}

  async sendMessage(userId: string, roomId: string, data: IMessageCreate) {
    return await this.db.message.create({
      data: { senderId: userId, roomId, ...data },
      select: this.selectMessageFields(),
    });
  }

  async listMessages(roomId: string, pageable: IChatPageable) {
    const { page = 1, limit = 10 } = pageable;
    return this.db.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      select: this.selectMessageFields(),
    });
  }

  async updateUserPresence(userId: string, status: "online" | "offline") {
    const userPresence = await this.db.userPresence.findFirst({
      where: { userId },
    });

    await this.db.userPresence.upsert({
      where: { id: userPresence?.id ?? "" },
      update: { lastActive: new Date() },
      create: { userId, lastActive: new Date() },
    });

    redis.set(this.userStatusCacheKey(userId), status);
  }

  async getUserPresence(userId: string) {
    const status = await redis.get(this.userStatusCacheKey(userId));
    const userPresence = await this.db.userPresence.findFirst({
      where: { userId },
      select: { lastActive: true },
    });

    return {
      status: status ?? "offline",
      lastSeen: userPresence?.lastActive ?? null,
    };
  }

  async getUserDetails(userId: string) {
    return this.db.user.findUnique({
      where: { id: userId },
      select: { id: true, firstname: true, lastname: true, email: true },
    });
  }

  async deliverAllUnacknowledgedMessages(userId: string) {
    // get all rooms
    const rooms = await this.db.room.findMany({
      where: { roomMember: { some: { userId } } },
    });

    const messages = await this.db.message.findMany({
      where: {
        messageReceipt: { none: { userId } },
        roomId: { in: rooms.map((room) => room.id) },
      },
    });

    if (messages.length === 0) return;

    await this.db.messageReceipt.createMany({
      data: messages.map((message) => ({
        userId,
        messageId: message.id,
        status: "DELIVERED",
      })),
    });
  }

  async markMessagesAsRead(userId: string, roomId: string) {
    const messages = await this.db.message.findMany({
      where: {
        roomId,
        messageReceipt: { some: { userId, status: "DELIVERED" } },
      },
    });

    if (messages.length === 0) return;

    await this.db.messageReceipt.updateMany({
      where: {
        userId,
        message: { roomId },
      },
      data: { status: "READ" },
    });
  }

  private userStatusCacheKey(userId: string) {
    return `user:${userId}:status`;
  }

  private selectMessageFields() {
    return {
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
    };
  }
}
