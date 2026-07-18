import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import passport from "passport";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";
import routes from "./routes/index.js";
import registerSocketHandlers from "./socket/socketHandler.js";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

configurePassport();
registerSocketHandlers(io);

app.use("/api", routes);

const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
