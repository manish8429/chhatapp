import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import UserList from "./UserList";
import { decodeToken } from "./auth";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?._id) {
        setUserId(decoded._id);
        socket.emit("register", decoded._id);
      } else {
        console.error("_id not found in decoded token!");
      }
    } else {
      console.error("No token found in localStorage!");
    }

    socket.on("receiveMessage", ({ senderId, content }) => {
      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), { id: Date.now(), content, sender: senderId }],
      }));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedUser || !userId) return;
    try {
      const response = await axios.get(`http://localhost:3000/api/messages/${userId}/${selectedUser._id}`);
      setMessages((prev) => ({
        ...prev,
        [selectedUser._id]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return alert("Message cannot be empty!");
    if (!selectedUser || !selectedUser._id) return alert("No user selected!");
    if (!userId) return alert("User ID missing!");

    const newMessage = { id: Date.now(), content: input, sender: userId, receiver: selectedUser._id };
    socket.emit("sendMessage", { senderId: userId, receiverId: selectedUser._id, content: input });

    try {
      await axios.post("http://localhost:3000/api/send", { sender: userId, receiver: selectedUser._id, content: input });
    } catch (error) {
      console.error("Message storage failed:", error);
    }

    setMessages((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), newMessage],
    }));

    setInput("");
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4">
        <UserList setSelectedUser={setSelectedUser} />
      </div>
      <div className="w-2/3 flex flex-col h-full p-4">
        <div className="flex-1 overflow-y-auto">
          {selectedUser ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Chat with {selectedUser.name}</h2>
              <div className="space-y-4">
                {(messages[selectedUser._id] || []).map((message, index) => (
                  <div key={message.id || index} className={`flex items-start gap-2 ${message.sender === userId ? "justify-end" : ""}`}>
                    <div className={`rounded-lg p-3 max-w-xs ${message.sender === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>
        {selectedUser && (
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="relative bg-gray-100 p-2 rounded-lg flex items-center">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="flex-1 p-2 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex items-center space-x-2 ml-2">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700"><Paperclip className="w-5 h-5" /></button>
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700"><Mic className="w-5 h-5" /></button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-1">Send <CornerDownLeft className="w-4 h-4" /></button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
