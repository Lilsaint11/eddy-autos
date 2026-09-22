import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./config/database.js";
import carRoutes from "./routes/carRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/cars", carRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Eddy Autos API is running",
  });
});

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Prevents Sequelize from altering or dropping existing seeded tables
    await sequelize.sync({ force: false, alter: false });

    console.log("Database synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();