import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER?.replace("/api/v1", "") || "";

export function getSocket(token?: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SERVER_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
