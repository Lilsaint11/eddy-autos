import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { io } from "socket.io-client";

const ChatContext = createContext(null);

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "");

// Generate or retrieve one persistent client session ID.
const getSessionId = () => {
  let id = localStorage.getItem("chat_session_id");

  if (!id) {
    id = `session_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}`;

    localStorage.setItem("chat_session_id", id);
  }

  return id;
};

export const ChatProvider = ({ children }) => {
  const socketRef = useRef(null);
  const joinedRoomsRef = useRef(new Set());

  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [sessionId] = useState(getSessionId);

  useEffect(() => {
    const socketInstance = io(API_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

   const handleConnect = () => {
  console.log(
    "Chat socket connected:",
    socketInstance.id
  );

  setIsConnected(true);

  joinedRoomsRef.current.forEach((room) => {
    if (!room?.carId || !room?.sessionId) {
      console.warn(
        "⚠️ Skipping invalid stored chat room:",
        room
      );
      return;
    }

    console.log(
      "🔄 Rejoining conversation:",
      room
    );

    socketInstance.emit(
      "join_conversation",
      {
        carId: String(room.carId),
        sessionId: String(room.sessionId),
      }
    );
  });
};

    const handleDisconnect = (reason) => {
      console.log("Chat socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error("Chat socket connection error:", error.message);
      setIsConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.disconnect();

      socketRef.current = null;
      joinedRoomsRef.current.clear();
      setSocket(null);
    };
  }, []);

const joinConversation = (carId) => {
  if (!carId) {
    console.warn("❌ joinConversation called without carId:", {
      carId,
      sessionId,
    });
    return;
  }

  if (!sessionId) {
    console.warn("❌ joinConversation called without sessionId:", {
      carId,
      sessionId,
    });
    return;
  }

  const room = {
    carId: String(carId),
    sessionId: String(sessionId),
  };

  console.log("➡️ Joining conversation:", room);

  // IMPORTANT: store the object, not a "carId:sessionId" string
  joinedRoomsRef.current.add(room);

  const currentSocket = socketRef.current;

  if (!currentSocket) {
    console.warn("❌ Socket is not initialized");
    return;
  }

  if (!currentSocket.connected) {
    console.log(
      "⏳ Socket isn't connected yet. Room will be joined after connection."
    );
    return;
  }

  console.log("📤 Emitting join_conversation:", room);

  currentSocket.emit("join_conversation", room);
};

  const sendMessage = (carId, text, clientName) => {
    return new Promise((resolve, reject) => {
      const currentSocket = socketRef.current;
      const cleanText = String(text || "").trim();

      if (!cleanText) {
        reject(new Error("Message cannot be empty."));
        return;
      }

      if (!currentSocket) {
        reject(new Error("Chat socket is not initialized."));
        return;
      }

      if (!currentSocket.connected) {
        reject(new Error("Chat is not connected. Please try again."));
        return;
      }

      const payload = {
        carId: String(carId),
        sessionId,
        text: cleanText,
        clientName: clientName?.trim() || "Anonymous",
      };

      // The server acknowledges only after the message is saved.
      currentSocket.emit("send_message", payload, (response) => {
        if (response?.ok) {
          resolve(response.message);
        } else {
          reject(
            new Error(response?.error || "Failed to send message.")
          );
        }
      });
    });
  };

  const adminJoin = useCallback(() => {
  const currentSocket = socketRef.current;

  if (!currentSocket) {
    console.warn(
      "❌ Cannot join admin room: socket doesn't exist"
    );
    return;
  }

  if (!currentSocket.connected) {
    console.warn(
      "❌ Cannot join admin room: socket isn't connected"
    );
    return;
  }

  console.log(
    "📤 Sending admin_join from socket:",
    currentSocket.id
  );

  currentSocket.emit("admin_join");
}, []);

const adminJoinConversation = (carId, conversationSessionId) => {
  const currentSocket = socketRef.current;

  if (!currentSocket) {
    console.warn("Chat socket is not initialized.");
    return;
  }

  if (!currentSocket.connected) {
    console.warn(
      "Cannot join conversation: socket is not connected."
    );
    return;
  }

  const room = {
    carId: String(carId),
    sessionId: String(conversationSessionId),
  };

  console.log(
    "Admin joining conversation room:",
    `${room.carId}:${room.sessionId}`
  );

  currentSocket.emit("join_conversation", room);
};

 const adminReply = (carId, conversationSessionId, text) => {
  return new Promise((resolve, reject) => {
    const currentSocket = socketRef.current;
    const cleanText = String(text || "").trim();

    if (!currentSocket?.connected) {
      reject(new Error("Chat is not connected."));
      return;
    }

    if (!cleanText) {
      reject(new Error("Reply cannot be empty."));
      return;
    }

    currentSocket.emit(
      "admin_reply",
      {
        carId: String(carId),
        sessionId: conversationSessionId,
        text: cleanText,
      },
      (response) => {
        if (response?.ok) {
          resolve(response.message);
        } else {
          reject(
            new Error(
              response?.error || "Failed to send reply."
            )
          );
        }
      }
    );
  });
};

  const onNewMessage = (callback) => {
    socketRef.current?.on("new_message", callback);
  };

  const offNewMessage = (callback) => {
    socketRef.current?.off("new_message", callback);
  };

  const onNewConversationMessage = (callback) => {
    socketRef.current?.on("new_conversation_message", callback);
  };

  const offNewConversationMessage = (callback) => {
    socketRef.current?.off("new_conversation_message", callback);
  };

  const fetchHistory = async (carId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/chat/${carId}/${sessionId}`
      );

      if (!res.ok) {
        console.error("Failed to fetch chat history:", res.status);
        return [];
      }

      return await res.json();
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return [];
    }
  };

  const fetchAllConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chat/conversations/all`);

      if (!res.ok) return [];

      return await res.json();
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  };

  const fetchConversationHistory = async (
    carId,
    conversationSessionId
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/api/chat/${carId}/${conversationSessionId}`
      );

      if (!res.ok) return [];

      return await res.json();
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return [];
    }
  };

  const markConversationRead = async (
    carId,
    conversationSessionId
  ) => {
    try {
      await fetch(
        `${API_URL}/api/chat/${carId}/${conversationSessionId}/read`,
        {
          method: "PUT",
        }
      );
    } catch (error) {
      console.error("Error marking conversation as read:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        isConnected,
        sessionId,
        joinConversation,
        sendMessage,
        adminJoin,
        adminJoinConversation,
        adminReply,
        onNewMessage,
        offNewMessage,
        onNewConversationMessage,
        offNewConversationMessage,
        fetchHistory,
        fetchAllConversations,
        fetchConversationHistory,
        markConversationRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};
