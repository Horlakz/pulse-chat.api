import { PrismaService } from "@/config/prisma";
import { BadRequestException, NotFoundException } from "@/exceptions";
import { IRoomCreate } from "../chat.interface";

export class RoomService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: string, data: IRoomCreate) {
    const room = await this.db.room.create({
      data: { ...data, createdById: userId },
    });

    await this.db.roomMember.create({
      data: { userId, roomId: room.id, role: "ADMIN" },
    });
  }

  async listMyRooms(userId: string) {
    return this.db.roomMember.findMany({
      where: { userId },
      select: { room: { select: { id: true, name: true, type: true } } },
    });
  }

  async listPublicRooms() {
    return this.db.room.findMany({
      where: { type: "PUBLIC" },
      select: { id: true, name: true, type: true },
    });
  }

  async listMembers(userId: string, roomId: string) {
    const room = await this.db.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const isMember = await this.db.roomMember.findFirst({
      where: { userId, roomId },
    });

    if (!isMember) {
      throw new BadRequestException("User is not a member of the room");
    }

    return this.db.roomMember.findMany({
      where: { roomId },
      select: {
        user: { select: { firstname: true, lastname: true } },
        role: true,
      },
    });
  }

  async join(userId: string, roomId: string) {
    const room = await this.db.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException("Room not found");
    }

    const roomMember = await this.db.roomMember.findFirst({
      where: { userId, roomId },
    });

    if (roomMember) {
      throw new BadRequestException("User is already a member of the room");
    }

    await this.db.roomMember.create({
      data: { userId, roomId, role: "MEMBER" },
    });
  }

  async leave(userId: string, roomId: string) {
    const roomMember = await this.db.roomMember.findFirst({
      where: { userId, roomId },
    });

    if (!roomMember) {
      throw new NotFoundException("not a member of the room");
    }

    await this.db.roomMember.delete({
      where: { id: roomMember.id },
    });

    if (roomMember.role === "ADMIN") {
      const nextAdmin = await this.db.roomMember.findFirst({
        where: { roomId, role: "MEMBER" },
        orderBy: { createdAt: "asc" },
      });

      if (nextAdmin) {
        await this.db.roomMember.update({
          where: { id: nextAdmin.id },
          data: { role: "ADMIN" },
        });
      }
    }

    const memberCount = await this.db.roomMember.count({
      where: { roomId },
    });

    if (memberCount === 0) {
      await this.db.room.delete({
        where: { id: roomId },
      });
    }
  }
}
