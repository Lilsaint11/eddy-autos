import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

import sequelize from "./config/database.js";
import carRoutes from "./routes/carRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "https://eddy-autos.vercel.app",
];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Express CORS
app.use(cors(corsOptions));

// JSON body parser
app.use(express.json());

// =====================================================
// SOCKET.IO
// =====================================================

const io = new Server(server, {
  cors: corsOptions,
});

// =====================================================
// PATHS
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// STATIC FILES
// =====================================================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/cars", carRoutes);
app.use("/api/chat", chatRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Eddy Autos API is running",
  });
});

// =====================================================
// SOCKET.IO CHAT
// =====================================================

io.on("connection", (socket) => {
  console.log("=================================");
  console.log("Socket connected:", socket.id);
  console.log("=================================");

  // ---------------------------------------------------
  // CLIENT JOINS CONVERSATION
  // ---------------------------------------------------

  socket.on("join_conversation", ({ carId, sessionId }) => {
    try {
      if (!carId || !sessionId) {
        console.warn(
          "join_conversation missing carId or sessionId"
        );
        return;
      }

      const room = `${carId}:${sessionId}`;

      socket.join(room);

      console.log(
        `Socket ${socket.id} joined room: ${room}`
      );
    } catch (error) {
      console.error(
        "Error joining conversation:",
        error
      );
    }
  });

  // ---------------------------------------------------
  // ADMIN JOINS ADMIN ROOM
  // ---------------------------------------------------

  socket.on("admin_join", () => {
    socket.join("admin");

    console.log(
      `Admin socket ${socket.id} joined admin room`
    );
  });

  // ---------------------------------------------------
  // CLIENT SENDS MESSAGE
  // ---------------------------------------------------

  socket.on(
    "send_message",
    async (
      { carId, sessionId, clientName, text },
      acknowledge
    ) => {
      try {
        console.log("Incoming client message:", {
          carId,
          sessionId,
          clientName,
          text,
        });

        const cleanText = String(text || "").trim();

        // Validate
        if (!carId || !sessionId || !cleanText) {
          const response = {
            ok: false,
            error:
              "carId, sessionId and text are required.",
          };

          if (typeof acknowledge === "function") {
            acknowledge(response);
          }

          return;
        }

        // ------------------------------------------------
        // SAVE MESSAGE TO DATABASE
        // ------------------------------------------------

        const message = await Message.create({
          carId,
          sessionId,
          clientName:
            clientName || "Anonymous",
          senderType: "client",
          text: cleanText,
          read: false,
        });

        // Convert Sequelize object to normal JSON
        const messageData = message.toJSON();

        console.log(
          "Message saved:",
          messageData
        );

        // ------------------------------------------------
        // GET CHAT ROOM
        // ------------------------------------------------

        const room = `${carId}:${sessionId}`;

        // ------------------------------------------------
        // SEND MESSAGE TO CLIENT
        // ------------------------------------------------

        io.to(room).emit(
          "new_message",
          messageData
        );

        // ------------------------------------------------
        // SEND MESSAGE TO ADMIN
        // ------------------------------------------------

        io.to("admin").emit(
          "new_conversation_message",
          {
            ...messageData,
            room,
          }
        );

        // ------------------------------------------------
        // ACKNOWLEDGE SUCCESS
        // ------------------------------------------------

        if (typeof acknowledge === "function") {
          acknowledge({
            ok: true,
            message: messageData,
          });
        }

        console.log(
          `Message emitted to room: ${room}`
        );
      } catch (error) {
        console.error(
          "Error saving client message:",
          error
        );

        if (typeof acknowledge === "function") {
          acknowledge({
            ok: false,
            error: "Failed to send message.",
          });
        }

        socket.emit("chat_error", {
          message: "Failed to send message.",
        });
      }
    }
  );

  // ---------------------------------------------------
  // ADMIN SENDS REPLY
  // ---------------------------------------------------

  socket.on(
    "admin_reply",
    async (
      { carId, sessionId, text },
      acknowledge
    ) => {
      try {
        console.log("Incoming admin reply:", {
          carId,
          sessionId,
          text,
        });

        const cleanText = String(text || "").trim();

        if (!carId || !sessionId || !cleanText) {
          const response = {
            ok: false,
            error:
              "carId, sessionId and text are required.",
          };

          if (typeof acknowledge === "function") {
            acknowledge(response);
          }

          return;
        }

        // ------------------------------------------------
        // SAVE ADMIN MESSAGE
        // ------------------------------------------------

        const message = await Message.create({
          carId,
          sessionId,
          clientName: "Eddy (Admin)",
          senderType: "admin",
          text: cleanText,
          read: true,
        });

        const messageData = message.toJSON();

        const room = `${carId}:${sessionId}`;

        console.log(
          "Admin reply saved:",
          messageData
        );

        // ------------------------------------------------
        // SEND TO CLIENT
        // ------------------------------------------------

        io.to(room).emit(
          "new_message",
          messageData
        );

        // ------------------------------------------------
        // ACKNOWLEDGE
        // ------------------------------------------------

        if (typeof acknowledge === "function") {
          acknowledge({
            ok: true,
            message: messageData,
          });
        }

        console.log(
          `Admin reply emitted to room: ${room}`
        );
      } catch (error) {
        console.error(
          "Error saving admin reply:",
          error
        );

        if (typeof acknowledge === "function") {
          acknowledge({
            ok: false,
            error: "Failed to send reply.",
          });
        }

        socket.emit("chat_error", {
          message: "Failed to send reply.",
        });
      }
    }
  );

  // ---------------------------------------------------
  // DISCONNECT
  // ---------------------------------------------------

  socket.on("disconnect", (reason) => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );

    console.log(
      "Reason:",
      reason
    );
  });
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Connect to database
    await sequelize.authenticate();

    console.log(
      "Database connected successfully."
    );

    // Sync database
    await sequelize.sync({
      force: false,
      alter: true,
    });

    console.log(
      "Database synchronized."
    );

    // Start HTTP + Socket.IO server
    server.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );

      console.log(
        `Socket.IO running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Unable to start server:",
      error
    );
  }
}

startServer();