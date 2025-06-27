import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Poll schema/model (options as array of objects)
const pollSchema = new mongoose.Schema({
  question: String,
  options: [
    {
      text: String,
      isCorrect: Boolean,
      votes: { type: Number, default: 0 },
    },
  ],
  timer: Number,
});
const Poll = mongoose.model("Poll", pollSchema);

// API routes
app.post("/api/polls", async (req, res) => {
  const { question, options, timer } = req.body;
  // Ensure each option has a votes field
  const optionsWithVotes = options.map((opt) => ({
    text: opt.text,
    isCorrect: !!opt.isCorrect,
    votes: 0,
  }));
  const poll = new Poll({
    question,
    options: optionsWithVotes,
    timer,
  });
  await poll.save();
  res.status(201).json(poll);
  io.emit("pollCreated", poll);
});

app.get("/api/polls", async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

app.post("/api/polls/:id/vote", async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll) return res.status(404).json({ error: "Poll not found" });
  if (poll.options[optionIndex]) {
    poll.options[optionIndex].votes += 1;
  }
  await poll.save();
  res.json(poll);
  io.emit("voteUpdate", poll);
});

// API route to delete all polls (for starting new session)
app.delete("/api/polls", async (req, res) => {
  await Poll.deleteMany({});
  io.emit("pollsCleared"); // Optionally notify all clients
  res.json({ message: "All polls deleted" });
});

// Track connected students
let participants = [];
const kickedStudents = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for student joining
  socket.on("joinAsStudent", (studentName) => {
    if (kickedStudents.has(studentName)) {
      // Don't allow rejoining if kicked
      console.log(`Blocked kicked student from rejoining: ${studentName}`);
      return;
    }
    socket.studentName = studentName; // Always set this for the socket
    console.log(`Student joined: ${studentName} (socket: ${socket.id})`);
    if (studentName && !participants.includes(studentName)) {
      participants.push(studentName);
    }
    io.emit("participantsUpdate", participants);
    // Log all current sockets and their studentName
    for (const [id, s] of io.of("/").sockets) {
      console.log(`Socket ${id} studentName: ${s.studentName}`);
    }
  });

  // Listen for teacher kicking a student
  socket.on("kickStudent", (studentName) => {
    console.log(`Teacher requested to kick: ${studentName}`);
    kickedStudents.add(studentName);
    let kickedAny = false;
    for (const [id, s] of io.of("/").sockets) {
      if (s.studentName === studentName) {
        console.log(`Kicking socket ${id} for student ${studentName}`);
        s.emit("kicked");
        s.disconnect(true);
        kickedAny = true;
      }
    }
    participants = participants.filter((n) => n !== studentName);
    io.emit("participantsUpdate", participants);
    if (!kickedAny) {
      console.log(`No socket found for student ${studentName}`);
    }
  });

  // Listen for teacher ending the poll
  socket.on("endPoll", () => {
    io.emit("pollEnded"); // Broadcast to all clients
    console.log("Poll ended by teacher, broadcasted to all clients.");
  });

  // Chat message relay
  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    // Remove participant if present
    if (socket.studentName) {
      participants = participants.filter((n) => n !== socket.studentName);
      io.emit("participantsUpdate", participants);
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
