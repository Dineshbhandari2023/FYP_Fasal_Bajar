"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { sendMessage, clearErrors } from "../Redux/slice/messageSlice";

export function StartChatButton({ farmerId, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { sendStatus, sendError } = useSelector((state) => state.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleStartChat = async () => {
    // Clear any previous errors
    setLocalError(null);
    dispatch(clearErrors());

    // If user is not logged in, redirect to login
    if (!userInfo) {
      navigate("/login", { state: { from: `/farmer/${farmerId}` } });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting chat with farmer ID:", farmerId);

      // Send an initial message to create the conversation
      const result = await dispatch(
        sendMessage({
          receiverId: farmerId,
          content: "Hello, I'm interested in your products!",
        })
      ).unwrap();

      console.log("Message sent successfully:", result);

      // Navigate to messages page
      navigate("/messages");
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setLocalError(
        error?.message || "Failed to start conversation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if there's an error to display
  const errorToShow =
    localError || (sendStatus === "failed" ? sendError : null);

  return (
    <div className="w-full">
      <button
        onClick={handleStartChat}
        disabled={isLoading || sendStatus === "loading"}
        className={`px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-xs sm:text-sm flex items-center justify-center ${className}`}
      >
        {isLoading || sendStatus === "loading" ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600 mr-2"></div>
        ) : (
          <MessageSquare className="h-4 w-4 mr-2" />
        )}
        Message Farmer
      </button>

      {errorToShow && (
        <div className="mt-2 text-xs text-red-500 text-center">
          {errorToShow}
        </div>
      )}
    </div>
  );
}
