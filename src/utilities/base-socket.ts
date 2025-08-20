import { Socket } from "socket.io";

export abstract class BaseSocketController {
  protected socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  protected on<EventPayload>(
    event: string,
    handler: (payload: EventPayload) => Promise<void> | void
  ) {
    this.socket.on(event, async (payload: EventPayload) => {
      try {
        await handler(payload);
      } catch (err: any) {
        console.error(`[Socket Error] ${event}:`, err);
        this.socket.emit("error", {
          event,
          message: err.message || "Unexpected error",
        });
      }
    });
  }
}
