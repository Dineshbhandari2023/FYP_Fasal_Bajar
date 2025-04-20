// SupplierMessagesPage.jsx
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  addNewMessage,
} from "../../Redux/slice/messageSlice";
import socket from "../utils/messageSocket";
import { SupplierLayout } from "../SupplierLayout";
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
} from "lucide-react";

export default function SupplierMessagesPage() {
  const { contactId } = useParams();
  const dispatch = useDispatch();
  const { conversations, messages, loading, error } = useSelector(
    (s) => s.messages
  );
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  // 1) load conversations on mount
  useEffect(() => {
    dispatch(fetchConversations());
    // connect socket once
    socket.auth = { token: localStorage.getItem("accessToken") };
    socket.connect();
    socket.on("new_message", (msg) => {
      dispatch(addNewMessage(msg));
    });
    return () => {
      socket.off("new_message");
      socket.disconnect();
    };
  }, [dispatch]);

  // 2) whenever contactId changes, fetch that chat and mark read
  useEffect(() => {
    if (contactId) {
      dispatch(fetchMessages(contactId));
      dispatch(markMessagesAsRead(contactId));
    }
  }, [contactId, dispatch]);

  // 3) scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    dispatch(
      sendMessage({
        receiverId: contactId,
        content: messageText.trim(),
      })
    ).then(({ payload }) => {
      // also emit via socket for real‑time
      socket.emit("send_message", payload);
    });
    setMessageText("");
  };

  // find the contact in conversations
  const contact = conversations.find(
    (c) => String(c.id) === String(contactId)
  )?.user;

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/supplier/orders" className="text-sm text-blue-600">
            ← Back to Orders
          </Link>
          <h1 className="text-2xl font-bold">Chat with {contact?.username}</h1>
        </div>
        <div className="bg-white flex border rounded-lg shadow-sm h-[600px]">
          {/* Conversations list */}
          <div className="w-1/3 border-r overflow-y-auto p-4">
            <h2 className="font-medium mb-4">Conversations</h2>
            {conversations.map((conv) => (
              <Link
                to={`/supplier/messages/${conv.id}`}
                key={conv.id}
                className={`block p-2 mb-2 rounded ${
                  String(conv.id) === String(contactId)
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between">
                  <span>{conv.user.username}</span>
                  {conv.unreadCount > 0 && (
                    <span className="bg-green-600 text-white text-xs px-2 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {conv.lastMessage.content}
                </p>
              </Link>
            ))}
          </div>

          {/* Chat window */}
          <div className="flex-1 flex flex-col">
            {contact ? (
              <>
                {/* header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="font-medium">{contact.username}</h3>
                    <p className="text-xs text-gray-500">
                      {contactId === String(contact.id) ? contact.role : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button>
                      <Phone />
                    </button>
                    <button>
                      <Video />
                    </button>
                    <button>
                      <MoreVertical />
                    </button>
                  </div>
                </div>

                {/* messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        String(msg.senderId) === contactId
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[70%] ${
                          String(msg.senderId) === contactId
                            ? "bg-gray-100"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* input */}
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 p-4 border-t"
                >
                  <button type="button">
                    <Paperclip />
                  </button>
                  <button type="button">
                    <ImageIcon />
                  </button>
                  <input
                    className="flex-1 border px-4 py-2 rounded-full focus:outline-none"
                    placeholder="Type a message…"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="button">
                    <Smile />
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-full"
                    disabled={!messageText.trim()}
                  >
                    <Send />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
