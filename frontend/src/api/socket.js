import { io } from "socket.io-client";

let socket = null;

export function getSocket() {

  if (!socket) {

    socket = io(
      import.meta.env.VITE_SOCKET_URL,
      {
        autoConnect: false,
        withCredentials: true,

        auth: {
          token: localStorage.getItem(
            "eitp_access_token"
          )
        },

        transports: ["websocket"]
      }
    );

  }

  return socket;

}

export function connectSocket() {

  const socket = getSocket();

  // update latest token before connect
  socket.auth = {
    token: localStorage.getItem(
      "eitp_access_token"
    )
  };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {

  if (socket?.connected) {
    socket.disconnect();
  }

}

export function reconnectSocket() {

  disconnectSocket();

  return connectSocket();

}