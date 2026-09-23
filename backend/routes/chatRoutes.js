import express from "express";
import Message from "../models/Message.js";
import { Op } from "sequelize";

const router = express.Router();

/*
  GET ALL CONVERSATIONS (admin)
  GET /api/chat/conversations/all
*/
router.get("/conversations/all", async (req, res) => {
  try {
    // Get all messages, newest first
    const messages = await Message.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Group by carId + sessionId
    const conversationsMap = new Map();

    for (const msg of messages) {
      const key = `${msg.carId}:${msg.sessionId}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          carId: msg.carId,
          sessionId: msg.sessionId,
          clientName: msg.clientName,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          senderType: msg.senderType,
          unreadCount: 0,
        });
      }

      // Count unread client messages
      if (msg.senderType === "client" && !msg.read) {
        const conversation = conversationsMap.get(key);
        conversation.unreadCount++;
      }
    }

    res.status(200).json(
      Array.from(conversationsMap.values())
    );
  } catch (error) {
    console.error(
      "Error fetching conversations:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
});

/*
  GET CONVERSATION HISTORY
  GET /api/chat/:carId/:sessionId
*/
router.get("/:carId/:sessionId", async (req, res) => {
  try {
    const { carId, sessionId } = req.params;

    const messages = await Message.findAll({
      where: {
        carId,
        sessionId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(
      "Error fetching messages:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

/*
  MARK MESSAGES AS READ
  PUT /api/chat/:carId/:sessionId/read
*/
router.put("/:carId/:sessionId/read", async (req, res) => {
  try {
    const { carId, sessionId } = req.params;

    await Message.update(
      { read: true },
      {
        where: {
          carId,
          sessionId,
          senderType: "client",
        },
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(
      "Error marking messages as read:",
      error
    );

    res.status(500).json({
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
});

export default router;