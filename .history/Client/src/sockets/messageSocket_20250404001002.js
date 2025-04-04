import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8000/messages";

const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});

export default socket;
