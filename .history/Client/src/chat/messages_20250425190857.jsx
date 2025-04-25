import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../Redux/slice/messageSlice";
import { Navigation } from "../UI/navigation";
import { Footer } from "../UI/footer";
import { MessageList } from "../chat/messageList";
import { ConversationView } from "../chat/conversationView";
import { Search, MessageSquare } from "lucide-react";
import socket from "../sockets/messageSocket";

export default function MessagesPage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { conversations, loading, error } = useSelector(
    (state) => state.messages
  );

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [filter, setFilter] = useState("all"); // "all", "farmers", "suppliers"

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations());

    // Connect to socket
    socket.connect();

    // Listen for new messages to refresh conversations
    socket.on("new_message", () => {
      dispatch(fetchConversations());
    });

    return () => {
      socket.off("new_message");
    };
  }, [dispatch]);

  // Filter conversations by search term and type
  const filteredConversations = (
    Array.isArray(conversations) ? conversations : []
  ).filter((conversation) => {
    const otherPerson =
      conversation.user || conversation.farmer || conversation.supplier || {};
    const username = (otherPerson?.username || "").toLowerCase();
    const role = (otherPerson?.role || "").toLowerCase();

    // Apply search filter
    const matchesSearch = username.includes(searchTerm.toLowerCase());

    // Apply type filter
    if (filter === "farmers") {
      return matchesSearch && role === "farmer";
    } else if (filter === "suppliers") {
      return matchesSearch && role === "supplier";
    }

    return matchesSearch;
  });

  // Handle conversation selection
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowMobileConversation(true);
    }
  };

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowMobileConversation(false);
    setSelectedConversation(null);
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your messages.
            </p>
            <a
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Log In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex h-[calc(80vh-100px)]">
            {/* Conversation List */}
            <div
              className={`${
                isMobile && showMobileConversation ? "hidden" : "flex"
              } flex-col w-full md:w-1/3 border-r border-gray-200`}
            >
              {/* Search and Filter Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2 mt-2">
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      filter === "all"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      filter === "farmers"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("farmers")}
                  >
                    Farmers
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-full ${
                      filter === "suppliers"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("suppliers")}
                  >
                    Suppliers
                  </button>
                </div>
              </div>
              {/* Conversations List */}
              <MessageList
                conversations={filteredConversations}
                loading={loading}
                error={error}
                selectedId={selectedConversation?.id}
                onSelectConversation={handleSelectConversation}
              />
            </div>
            {/* Conversation View */}
            <div
              className={`${
                isMobile && !showMobileConversation ? "hidden" : "flex"
              } flex-col w-full md:w-2/3`}
            >
              {selectedConversation ? (
                <ConversationView
                  conversation={selectedConversation}
                  currentUser={userInfo}
                  onBack={isMobile ? handleBackToList : null}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Select a conversation
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Choose a conversation from the list to start chatting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
