import type { Request, Response } from "express";

import { BaseResponse } from "@/utilities/base-reponse";
import { RoomService } from "../services/room.service";

export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  createRoom = async (req: Request, res: Response) => {
    await this.roomService.create(req.user.sub, req.body);
    res.json(BaseResponse.success(null));
  };

  myRooms = async (req: Request, res: Response) => {
    const rooms = await this.roomService.listMyRooms(req.user.sub);
    res.json(BaseResponse.success(rooms));
  };

  listPublicRooms = async (_: Request, res: Response) => {
    const rooms = await this.roomService.listPublicRooms();
    res.json(BaseResponse.success(rooms));
  };

  listRoomMembers = async (req: Request<{ roomId: string }>, res: Response) => {
    const members = await this.roomService.listMembers(
      req.user.sub,
      req.params.roomId
    );
    res.json(BaseResponse.success(members));
  };

  joinRoom = async (req: Request<{ roomId: string }>, res: Response) => {
    await this.roomService.join(req.user.sub, req.params.roomId);
    res.json(BaseResponse.success(null));
  };

  leaveRoom = async (req: Request<{ roomId: string }>, res: Response) => {
    await this.roomService.leave(req.user.sub, req.params.roomId);
    res.json(BaseResponse.success(null));
  };
}
