import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { sendMessage, clearErrors } from "../Redux/slice/messageSlice";
// Inside StartChatButton.jsx, at the top of handleStartChat
import messageSocket, { connectMessageSocket } from "../sockets/messageSocket";

// Inside handleStartChat
const handleStartChat = async () => {
  connectMessageSocket(); // Ensure socket is connected
  setLocalError(null);
  dispatch(clearErrors());
  // Rest of the function remains the same
};

export function StartChatButton({ farmerId, supplierId, className = "" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { sendStatus, sendError } = useSelector((state) => state.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Determine the entity type and ID
  const entityId = farmerId || supplierId;
  const entityType = farmerId ? "Farmer" : "Supplier";
  const buttonLabel = `Message ${entityType}`;

  useEffect(() => {
    setLocalError(null);
  }, []);

  const handleStartChat = async () => {
    setLocalError(null);
    dispatch(clearErrors());

    if (!userInfo) {
      navigate("/login", {
        state: { from: `/${entityType.toLowerCase()}/${entityId}` },
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Starting chat with ${entityType} ID:`, entityId);

      const result = await dispatch(
        sendMessage({
          receiverId: entityId,
          content: `Hello, I'm interested in your ${entityType.toLowerCase()} services!`,
        })
      ).unwrap();

      console.log("Message sent successfully:", result);
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
        {buttonLabel}
      </button>

      {errorToShow && (
        <div className="mt-2 text-xs text-red-500 text-center">
          {errorToShow}
        </div>
      )}
    </div>
  );
}

export default StartChatButton;
