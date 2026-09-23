import React, { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "../context/ChatContext";
import { useCars } from "../context/CarsContext";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  User,
  Circle,
} from "lucide-react";

const AdminChatInbox = () => {
  const {
    adminJoin,
    adminReply,
    adminJoinConversation,
    onNewMessage,
    offNewMessage,
    onNewConversationMessage,
    offNewConversationMessage,
    fetchAllConversations,
    fetchConversationHistory,
    markConversationRead,
    isConnected,
  } = useChat();

  const { cars } = useCars();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  const chatEndRef = useRef(null);

  /*
   * ---------------------------------------------------------
   * HELPERS
   * ---------------------------------------------------------
   */

  const conversationKey = (carId, sessionId) =>
    `${String(carId)}:${String(sessionId)}`;

  const isSameConversation = (a, b) => {
    if (!a || !b) return false;

    return (
      String(a.carId) === String(b.carId) &&
      String(a.sessionId) === String(b.sessionId)
    );
  };

  /*
   * ---------------------------------------------------------
   * JOIN ADMIN SOCKET ROOM
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!isConnected) return;

    console.log("🟢 Admin socket connected. Joining admin room...");

    adminJoin();
  }, [isConnected, adminJoin]);

  /*
   * ---------------------------------------------------------
   * LOAD CONVERSATIONS
   * ---------------------------------------------------------
   */

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      const convs = await fetchAllConversations();

      setConversations(
        Array.isArray(convs) ? convs : []
      );
    } catch (error) {
      console.error(
        "Failed to load conversations:",
        error
      );

      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAllConversations]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  /*
   * ---------------------------------------------------------
   * REAL-TIME CONVERSATION LIST UPDATES
   *
   * This handles new messages coming from clients and keeps
   * the left-side conversation list updated.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleNewConversationMessage = (msg) => {
      if (!msg?.carId || !msg?.sessionId) return;

      const key = conversationKey(
        msg.carId,
        msg.sessionId
      );

      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conversation) =>
            conversationKey(
              conversation.carId,
              conversation.sessionId
            ) === key
        );

        const isCurrentlyOpen =
          activeConv &&
          conversationKey(
            activeConv.carId,
            activeConv.sessionId
          ) === key;

        /*
         * If conversation already exists, update it.
         */
        if (existingIndex !== -1) {
          const updated = [...prev];

          const existing = updated[existingIndex];

          updated[existingIndex] = {
            ...existing,
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            senderType: msg.senderType,
            clientName:
              msg.clientName || existing.clientName,
            unreadCount: isCurrentlyOpen
              ? 0
              : (existing.unreadCount || 0) + 1,
          };

          /*
           * Put the most recently active conversation first.
           */
          updated.sort(
            (a, b) =>
              new Date(b.lastMessageTime) -
              new Date(a.lastMessageTime)
          );

          return updated;
        }

        /*
         * Brand-new conversation.
         */
        return [
          {
            carId: msg.carId,
            sessionId: msg.sessionId,
            clientName: msg.clientName || "Anonymous",
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            senderType: msg.senderType,
            unreadCount: isCurrentlyOpen ? 0 : 1,
          },
          ...prev,
        ];
      });
    };

    onNewConversationMessage(
      handleNewConversationMessage
    );

    return () => {
      offNewConversationMessage(
        handleNewConversationMessage
      );
    };
  }, [
    activeConv,
    onNewConversationMessage,
    offNewConversationMessage,
  ]);

  /*
   * ---------------------------------------------------------
   * REAL-TIME MESSAGE UPDATES
   *
   * IMPORTANT:
   * This is what makes a client's message appear instantly
   * while the admin is already inside that conversation.
   *
   * There should only be ONE new_message listener here.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleNewMessage = (message) => {
      if (!message?.carId || !message?.sessionId) {
        return;
      }

      /*
       * Update the conversation list preview even if the
       * admin isn't currently inside this conversation.
       */
      setConversations((prev) => {
        const key = conversationKey(
          message.carId,
          message.sessionId
        );

        const index = prev.findIndex(
          (conversation) =>
            conversationKey(
              conversation.carId,
              conversation.sessionId
            ) === key
        );

        if (index === -1) {
          return [
            {
              carId: message.carId,
              sessionId: message.sessionId,
              clientName:
                message.clientName || "Anonymous",
              lastMessage: message.text,
              lastMessageTime: message.createdAt,
              senderType: message.senderType,
              unreadCount:
                message.senderType === "client" ? 1 : 0,
            },
            ...prev,
          ];
        }

        const updated = [...prev];
        const existing = updated[index];

        const currentlyViewing =
          activeConv &&
          isSameConversation(activeConv, message);

        updated[index] = {
          ...existing,
          lastMessage: message.text,
          lastMessageTime: message.createdAt,
          senderType: message.senderType,
          clientName:
            message.clientName || existing.clientName,

          /*
           * Don't show an unread count while the admin
           * is already looking at the conversation.
           */
          unreadCount:
            currentlyViewing
              ? 0
              : message.senderType === "client"
              ? (existing.unreadCount || 0) + 1
              : existing.unreadCount || 0,
        };

        updated.sort(
          (a, b) =>
            new Date(b.lastMessageTime) -
            new Date(a.lastMessageTime)
        );

        return updated;
      });

      /*
       * If the admin isn't currently viewing this
       * conversation, there is nothing else to do.
       */
      if (!activeConv) return;

      /*
       * Only update the open conversation if this message
       * belongs to it.
       */
      if (!isSameConversation(activeConv, message)) {
        return;
      }

      /*
       * Prevent duplicate messages.
       */
      setMessages((prev) => {
        if (
          prev.some(
            (existing) =>
              String(existing.id) ===
              String(message.id)
          )
        ) {
          return prev;
        }

        return [...prev, message];
      });
    };

    onNewMessage(handleNewMessage);

    return () => {
      offNewMessage(handleNewMessage);
    };
  }, [
    activeConv,
    onNewMessage,
    offNewMessage,
  ]);

  /*
   * ---------------------------------------------------------
   * AUTO-SCROLL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * ---------------------------------------------------------
   * OPEN CONVERSATION
   * ---------------------------------------------------------
   */
const openConversation = async (conv) => {
  const conversation = {
    carId: conv.carId,
    sessionId: conv.sessionId,
    clientName: conv.clientName,
  };

  setActiveConv(conversation);
  setMessages([]);

  // IMPORTANT:
  // Admin joins the exact conversation room.
  adminJoinConversation(
    conv.carId,
    conv.sessionId
  );

  try {
    const msgs = await fetchConversationHistory(
      conv.carId,
      conv.sessionId
    );

    setMessages(msgs || []);

    await markConversationRead(
      conv.carId,
      conv.sessionId
    );

    setConversations((prev) =>
      prev.map((c) =>
        String(c.carId) === String(conv.carId) &&
        String(c.sessionId) ===
          String(conv.sessionId)
          ? {
              ...c,
              unreadCount: 0,
            }
          : c
      )
    );
  } catch (error) {
    console.error(
      "Failed to open conversation:",
      error
    );
  }
};

  /*
   * ---------------------------------------------------------
   * ADMIN REPLY
   * ---------------------------------------------------------
   */

  const handleReply = async (e) => {
    e.preventDefault();

    const text = replyText.trim();

    if (!text || !activeConv) return;

    try {
      const savedMessage = await adminReply(
        activeConv.carId,
        activeConv.sessionId,
        text
      );

      console.log(
        "Admin reply saved:",
        savedMessage
      );

      /*
       * ChatContext returns the message saved by the server.
       *
       * Add it immediately to the admin UI.
       */
      if (savedMessage) {
        setMessages((prev) => {
          /*
           * Prevent duplicate if the socket event also
           * delivers the same admin message.
           */
          if (
            prev.some(
              (message) =>
                String(message.id) ===
                String(savedMessage.id)
            )
          ) {
            return prev;
          }

          return [...prev, savedMessage];
        });

        /*
         * Update conversation preview.
         */
        setConversations((prev) =>
          prev
            .map((conversation) =>
              isSameConversation(
                conversation,
                savedMessage
              )
                ? {
                    ...conversation,
                    lastMessage: savedMessage.text,
                    lastMessageTime:
                      savedMessage.createdAt,
                    senderType: "admin",
                    unreadCount: 0,
                  }
                : conversation
            )
            .sort(
              (a, b) =>
                new Date(b.lastMessageTime) -
                new Date(a.lastMessageTime)
            )
        );
      }

      setReplyText("");
    } catch (error) {
      console.error(
        "Failed to send admin reply:",
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * CAR NAME
   * ---------------------------------------------------------
   */

  const getCarName = (carId) => {
    const car = cars.find(
      (c) => String(c.id) === String(carId)
    );

    return car
      ? car.name
      : `Car #${carId}`;
  };

  /*
   * ---------------------------------------------------------
   * TIME FORMAT
   * ---------------------------------------------------------
   */

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();

    const diffMs = now - d;
    const diffMins = Math.floor(
      diffMs / 60000
    );

    if (diffMins < 1) {
      return "Just now";
    }

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    const diffHours = Math.floor(
      diffMins / 60
    );

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  /*
   * ---------------------------------------------------------
   * TOTAL UNREAD
   * ---------------------------------------------------------
   */

  const totalUnread = conversations.reduce(
    (sum, conversation) =>
      sum +
      (conversation.unreadCount || 0),
    0
  );

  /*
   * ---------------------------------------------------------
   * BACK TO CONVERSATIONS
   * ---------------------------------------------------------
   */

  const closeConversation = () => {
    setActiveConv(null);
    setMessages([]);
    setReplyText("");

    /*
     * Refresh the list from the server so the admin sees
     * the latest conversation state.
     */
    loadConversations();
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <div className="h-full flex flex-col">
      {activeConv ? (
        /*
         * ===================================================
         * ACTIVE CONVERSATION
         * ===================================================
         */
        <div className="flex flex-col h-full">
          {/* Conversation Header */}
          <div className="flex items-center gap-4 p-6 border-b border-white/5">
            <button
              onClick={closeConversation}
              className="text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex-1">
              <h3 className="text-white font-bold text-sm">
                {activeConv.clientName ||
                  "Anonymous"}
              </h3>

              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">
                Re: {getCarName(activeConv.carId)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Circle
                size={6}
                className="text-emerald-500 fill-emerald-500"
              />

              <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                Live
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-6 space-y-3"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#333 transparent",
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <MessageSquare
                  size={28}
                  className="text-zinc-700"
                />

                <p className="text-zinc-600 text-xs">
                  No messages in this
                  conversation.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderType === "admin"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      msg.senderType === "admin"
                        ? "bg-red-600/90 text-white rounded-br-md"
                        : "bg-zinc-800/80 text-zinc-200 rounded-bl-md border border-white/5"
                    }`}
                  >
                    {msg.senderType ===
                      "client" && (
                      <span className="text-blue-400 text-[9px] font-black uppercase tracking-widest block mb-1">
                        {msg.clientName ||
                          "Anonymous"}
                      </span>
                    )}

                    {msg.senderType ===
                      "admin" && (
                      <span className="text-red-200/70 text-[9px] font-black uppercase tracking-widest block mb-1">
                        You
                      </span>
                    )}

                    <p className="text-xs leading-relaxed">
                      {msg.text}
                    </p>

                    <span
                      className={`text-[9px] mt-1 block ${
                        msg.senderType === "admin"
                          ? "text-red-200/60"
                          : "text-zinc-500"
                      }`}
                    >
                      {new Date(
                        msg.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Reply Input */}
          <form
            onSubmit={handleReply}
            className="p-6 pt-4 border-t border-white/5 flex gap-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
              placeholder="Type your reply..."
              className="flex-1 bg-zinc-900/60 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500/50 transition-all"
            />

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white p-3 rounded-xl transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /*
         * ===================================================
         * CONVERSATIONS LIST
         * ===================================================
         */
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-lg tracking-tight">
                  Messages
                </h2>

                <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold">
                  {conversations.length}{" "}
                  Conversation
                  {conversations.length !== 1
                    ? "s"
                    : ""}

                  {totalUnread > 0 && (
                    <span className="ml-2 text-red-500">
                      · {totalUnread} unread
                    </span>
                  )}
                </span>
              </div>

              <button
                onClick={loadConversations}
                className="text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
              >
                Refresh
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor:
                "#333 transparent",
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-zinc-500 text-xs font-semibold animate-pulse">
                  Loading conversations...
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <MessageSquare
                  size={36}
                  className="text-zinc-800"
                />

                <p className="text-zinc-600 text-xs">
                  No conversations yet.
                </p>

                <p className="text-zinc-700 text-[10px]">
                  Client messages will appear
                  here in real-time.
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conversationKey(
                    conv.carId,
                    conv.sessionId
                  )}
                  onClick={() =>
                    openConversation(conv)
                  }
                  className="w-full text-left p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer flex items-start gap-4 group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
                    <User
                      size={16}
                      className="text-zinc-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-bold text-sm truncate">
                        {conv.clientName ||
                          "Anonymous"}
                      </span>

                      <span className="text-zinc-600 text-[10px] font-semibold shrink-0 ml-2">
                        {formatTime(
                          conv.lastMessageTime
                        )}
                      </span>
                    </div>

                    <span className="text-red-500/80 text-[10px] uppercase tracking-widest font-bold block mb-1">
                      {getCarName(conv.carId)}
                    </span>

                    <p className="text-zinc-500 text-xs truncate">
                      {conv.senderType ===
                      "admin"
                        ? "You: "
                        : ""}
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0 mt-1">
                      <span className="text-white text-[9px] font-black">
                        {conv.unreadCount}
                      </span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChatInbox;