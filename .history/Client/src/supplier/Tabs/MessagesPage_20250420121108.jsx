// SupplierMessagesPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  addNewMessage,
} from "../../Redux/slice/messageSlice";
import socket from "../../utils/messageSocket";
import { SupplierLayout } from "../SupplierLayout";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  ImageIcon,
  Smile,
  Send,
} from "lucide-react";

export default function SupplierMessagesPage() {
  const { contactId } = useParams(); // ← grabs :contactId from the URL
  const dispatch = useDispatch();
  const { conversations, messages, loading, error } = useSelector(
    (s) => s.messages // ← make sure your root reducer key is `messages`
  );

  const [text, setText] = useState("");
  const endRef = useRef();

  // 1) load all conversations & wire up socket once
  useEffect(() => {
    dispatch(fetchConversations());
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

  // 2) whenever contactId changes, fetch that one‐to‐one chat & mark read
  useEffect(() => {
    if (contactId) {
      dispatch(fetchMessages(contactId));
      dispatch(markMessagesAsRead(contactId));
    }
  }, [contactId, dispatch]);

  // 3) scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({ receiverId: contactId, content: text.trim() })).then(
      ({ payload }) => {
        socket.emit("send_message", payload);
      }
    );
    setText("");
  };

  // who am I chatting with?
  const contact = conversations.find((c) => String(c.id) === contactId)?.user;

  return (
    <SupplierLayout>
      <div className="space-y-6">
        <Link to="/supplier/orders" className="text-sm text-blue-600">
          ← Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">
          Chat with {contact?.username || "…"}
        </h1>
        <div className="flex h-[500px] border rounded overflow-hidden">
          {/* Left: conversations list */}
          <div className="w-1/3 border-r p-4 overflow-y-auto">
            <h2 className="font-medium mb-2">Conversations</h2>
            {conversations.map((c) => (
              <Link
                to={`/supplier/messages/${c.id}`}
                key={c.id}
                className={`block p-2 mb-1 rounded ${
                  String(c.id) === contactId
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between">
                  <span>{c.user.username}</span>
                  {c.unreadCount > 0 && (
                    <span className="bg-green-600 text-white text-xs px-2 rounded-full">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {c.lastMessage.content}
                </p>
              </Link>
            ))}
          </div>

          {/* Right: chat window */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                Loading…
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div>
                    <h3 className="font-medium">{contact?.username}</h3>
                    <p className="text-xs text-gray-500">{contact?.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Phone className="h-5 w-5" />
                    <Video className="h-5 w-5" />
                    <MoreVertical className="h-5 w-5" />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${
                        String(m.senderId) === contactId
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[70%] ${
                          String(m.senderId) === contactId
                            ? "bg-gray-100"
                            : "bg-green-600 text-white"
                        }`}
                      >
                        <p className="text-sm">{m.content}</p>
                        <span className="text-xs text-gray-500 block text-right mt-1">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={endRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  className="flex items-center border-t p-3 space-x-2"
                >
                  <Paperclip className="h-5 w-5 text-gray-600 cursor-pointer" />
                  <ImageIcon className="h-5 w-5 text-gray-600 cursor-pointer" />
                  <input
                    type="text"
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                    placeholder="Type a message…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <Smile className="h-5 w-5 text-gray-600 cursor-pointer" />
                  <button
                    type="submit"
                    className="bg-green-600 text-white p-2 rounded-full"
                    disabled={!text.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
}
