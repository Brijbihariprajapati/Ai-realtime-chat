"use client";

import { io } from "socket.io-client";
import { getApiBase, getToken } from "./api";

let socket = null;

export const connectSocket = () => {
  const token = getToken();
  if (!token) throw new Error("Missing auth token");

  if (socket) {
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(getApiBase(), {
    auth: { token },
    transports: ["polling", "websocket"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
