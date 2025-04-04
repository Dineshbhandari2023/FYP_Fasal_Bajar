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
      const response = await api.get(`/api/messages/${userId}`);
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
      console.log("Sending message to:", API_URL + "/api/messages");
      console.log("Message data:", messageData);

      const response = await api.post("/api/messages", messageData);
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
      const response = await api.get("/api/messages/conversations");
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
      const response = await api.put(`/api/messages/read/${userId}`);
      return response.data;
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
    error: null,
    sendStatus: "idle",
    sendError: null,
  },
  reducers: {
    // For adding new messages received via Socket.IO
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
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
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch messages";
      })

      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
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
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.payload?.message || "Failed to send message";
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        // Update read status for messages in state if needed
        state.messages = state.messages.map((message) => {
          if (!message.read) {
            return { ...message, read: true };
          }
          return message;
        });
      });
  },
});

export const { addNewMessage, clearErrors } = messageSlice.actions;
export default messageSlice.reducer;
