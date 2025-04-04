import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the API base URL
const API_URL = "http://localhost:8000";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch messages between the current user and a specified user
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch messages" }
      );
    }
  }
);

// Send a new message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      console.log("Sending message to:", API_URL + "/messages");
      console.log("Message data:", messageData);

      const response = await api.post("/messages", messageData);
      console.log("Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to send message" }
      );
    }
  }
);

// Fetch all conversations for the current user
export const fetchConversations = createAsyncThunk(
  "messages/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/messages/conversations");
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch conversations" }
      );
    }
  }
);

// Mark messages as read for a given sender
export const markMessagesAsRead = createAsyncThunk(
  "messages/markMessagesAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/messages/read/${userId}`);
      return { userId, ...response.data };
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return rejectWithValue(
        error.response?.data || { message: "Failed to mark messages as read" }
      );
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    conversations: [],
    status: "idle",
    loading: false,
    error: null,
    sendStatus: "idle",
    sendError: null,
  },
  reducers: {
    // For adding new messages received via Socket.IO
    addNewMessage: (state, action) => {
      const newMessage = action.payload;

      // Check if message already exists to avoid duplicates
      const messageExists = state.messages.some(
        (msg) => msg.id === newMessage.id
      );

      if (!messageExists) {
        state.messages.push(newMessage);
      }

      // Update conversation with new message if it exists
      if (state.conversations.length > 0) {
        const senderId = Number(newMessage.senderId);
        const receiverId = Number(newMessage.receiverId);

        // Find the conversation this message belongs to
        const conversationIndex = state.conversations.findIndex((conv) => {
          const otherUserId = Number((conv.user || conv.farmer)?.id);
          return otherUserId === senderId || otherUserId === receiverId;
        });

        if (conversationIndex !== -1) {
          // Update the last message
          state.conversations[conversationIndex].lastMessage = newMessage;

          // Update unread count if needed
          if (senderId !== Number(localStorage.getItem("userId"))) {
            state.conversations[conversationIndex].unreadCount =
              (state.conversations[conversationIndex].unreadCount || 0) + 1;
          }
        }
      }
    },
    clearErrors: (state) => {
      state.error = null;
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch messages";
      })

      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch conversations";
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendStatus = "succeeded";

        // Add the new message to the messages array if it doesn't exist
        const messageExists = state.messages.some(
          (msg) => msg.id === action.payload.id
        );
        if (!messageExists) {
          state.messages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.payload?.message || "Failed to send message";
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const { userId } = action.payload;

        // Update read status for messages in state
        state.messages = state.messages.map((message) => {
          if (Number(message.senderId) === Number(userId) && !message.is_read) {
            return { ...message, is_read: true };
          }
          return message;
        });

        // Update unread count in conversations
        if (state.conversations.length > 0) {
          state.conversations = state.conversations.map((conv) => {
            const otherUserId = Number((conv.user || conv.farmer)?.id);
            if (otherUserId === Number(userId)) {
              return { ...conv, unreadCount: 0 };
            }
            return conv;
          });
        }
      });
  },
});

export const { addNewMessage, clearErrors } = messageSlice.actions;
export default messageSlice.reducer;
