import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { sendMessage } from "../Redux/slice/messageSlice";

export function StartChatButton({ farmerId, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async () => {
    // If user is not logged in, redirect to login
    if (!userInfo) {
      navigate("/login", { state: { from: `/farmer/${farmerId}` } });
      return;
    }

    setIsLoading(true);

    try {
      // Send an initial message to create the conversation
      await dispatch(
        sendMessage({
          receiverId: farmerId,
          content: "Hello, I'm interested in your products!",
        })
      ).unwrap();

      // Navigate to messages page
      navigate("/messages");
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert("Failed to start conversation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={isLoading}
      className={`px-3 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-xs sm:text-sm flex items-center justify-center ${className}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600 mr-2"></div>
      ) : (
        <MessageSquare className="h-4 w-4 mr-2" />
      )}
      Message Farmer
    </button>
  );
}
