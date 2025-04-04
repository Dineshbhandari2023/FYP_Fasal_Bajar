import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchConversations } from "../../Redux/slice/messageSlice";
import { ChatIcon } from "./chatIcon";
import socket from "../../Redux/messageSocket";

export function ChatWidget() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { conversations } = useSelector((state) => state.messages);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread messages
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const count = conversations.reduce((total, conversation) => {
        return total + (conversation.unreadCount || 0);
      }, 0);
      setUnreadCount(count);
    }
  }, [conversations]);

  // Fetch conversations and connect to socket
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchConversations());

      // Connect to socket
      socket.connect();

      // Listen for new messages
      socket.on("new_message", () => {
        dispatch(fetchConversations());
      });

      return () => {
        socket.off("new_message");
      };
    }
  }, [dispatch, userInfo]);

  // Only show the widget if user is logged in
  if (!userInfo) return null;

  return <ChatIcon unreadCount={unreadCount} />;
}
