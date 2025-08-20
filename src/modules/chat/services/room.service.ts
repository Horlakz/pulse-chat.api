import { PrismaService } from "@/config/prisma";
import { BadRequestException, NotFoundException } from "@/exceptions";
import { IRoomCreate } from "../chat.interface";

export class RoomService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: string, data: IRoomCreate) {
    await this.db.room.create({
      data: { ...data, createdById: userId },
    });
  }

  async listMyRooms(userId: string) {
    return this.db.room.findMany({
      where: { createdById: userId },
      select: { id: true, name: true, type: true },
    });
  }

  async listPublicRooms() {
    return this.db.room.findMany({
      where: { type: "PUBLIC" },
      select: { id: true, name: true, type: true },
    });
  }

  async listMembers(roomId: string) {
    return this.db.roomMember.findMany({
      where: { roomId },
      select: { userId: true, role: true },
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
      throw new NotFoundException("Room member not found");
    }

    await this.db.roomMember.delete({
      where: { id: roomMember.id },
    });
  }
}
