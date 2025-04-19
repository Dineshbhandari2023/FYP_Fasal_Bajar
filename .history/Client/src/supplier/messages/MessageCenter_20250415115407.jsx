import { useState } from "react";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
} from "lucide-react";

const contacts = [
  {
    id: "contact1",
    name: "Ramesh Patel",
    role: "Farmer",
    avatar: "/assets/avatar-farmer.png",
    lastMessage: "When will you arrive for pickup?",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "contact2",
    name: "Amit Sharma",
    role: "Buyer",
    avatar: "/assets/avatar-buyer.png",
    lastMessage: "Please call me when you're nearby",
    time: "9:45 AM",
    unread: 0,
    online: true,
  },
  {
    id: "contact3",
    name: "Sunil Kumar",
    role: "Farmer",
    avatar: "/assets/avatar-farmer2.png",
    lastMessage: "The vegetables are ready for pickup",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "contact4",
    name: "Priya Patel",
    role: "Buyer",
    avatar: "/assets/avatar-buyer2.png",
    lastMessage: "Is my order on the way?",
    time: "Yesterday",
    unread: 1,
    online: true,
  },
  {
    id: "contact5",
    name: "Anita Singh",
    role: "Farmer",
    avatar: "/assets/avatar-farmer3.png",
    lastMessage: "I've added some extra fruits as a bonus",
    time: "Monday",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "contact1",
    text: "Hello, I have the produce ready for pickup. When will you arrive?",
    time: "10:15 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "me",
    text: "Hi Ramesh, I'm currently on my way. Should be there in about 20 minutes.",
    time: "10:17 AM",
    isMe: true,
  },
  {
    id: 3,
    sender: "contact1",
    text: "Great! I'll have everything packed and ready. There are 5 crates in total.",
    time: "10:18 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "me",
    text: "Perfect. I have enough space in the truck. Is there anything specific I should know about handling the produce?",
    time: "10:20 AM",
    isMe: true,
  },
  {
    id: 5,
    sender: "contact1",
    text: "Yes, please be careful with the tomatoes. They're very ripe. The rest should be fine with normal handling.",
    time: "10:22 AM",
    isMe: false,
  },
  {
    id: 6,
    sender: "contact1",
    text: "Also, could you bring some empty crates for next week's pickup?",
    time: "10:23 AM",
    isMe: false,
  },
  {
    id: 7,
    sender: "me",
    text: "No problem, I'll bring the empty crates. See you soon!",
    time: "10:25 AM",
    isMe: true,
  },
  {
    id: 8,
    sender: "contact1",
    text: "When will you arrive for pickup?",
    time: "10:30 AM",
    isMe: false,
  },
];

export function MessageCenter() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // In a real app, you would send this message to your backend
      console.log("Sending message:", messageText);
      setMessageText("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border h-[600px] flex">
      {/* Contacts sidebar */}
      <div className="w-full md:w-1/3 border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Messages</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-8 pr-4 py-2 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(600px-73px)]">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 ${
                selectedContact.id === contact.id ? "bg-gray-50" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {contact.avatar ? (
                    <img
                      src={contact.avatar || "/placeholder.svg"}
                      alt={contact.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-gray-600">
                      {contact.name.charAt(0)}
                    </span>
                  )}
                </div>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm truncate">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 truncate">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-xs mr-1 ${
                        contact.role === "Farmer"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {contact.role}
                    </span>
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="hidden md:flex flex-col w-2/3">
        {/* Chat header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {selectedContact.avatar ? (
                  <img
                    src={selectedContact.avatar || "/placeholder.svg"}
                    alt={selectedContact.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {selectedContact.name.charAt(0)}
                  </span>
                )}
              </div>
              {selectedContact.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-medium">{selectedContact.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    selectedContact.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                {selectedContact.online ? "Online" : "Offline"}
                <span
                  className={`ml-1 inline-block px-1.5 py-0.5 rounded text-xs ${
                    selectedContact.role === "Farmer"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedContact.role}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Phone className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.isMe
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-xs mt-1 block text-right ${
                    message.isMe ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t flex items-center gap-2"
        >
          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <ImageIcon className="h-5 w-5 text-gray-600" />
          </button>
          <input
            id="message"
            type="text"
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button type="button" className="p-2 rounded-full hover:bg-gray-100">
            <Smile className="h-5 w-5 text-gray-600" />
          </button>
          <button
            type="submit"
            className={`p-2 rounded-full ${
              messageText.trim()
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-400"
            }`}
            disabled={!messageText.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
