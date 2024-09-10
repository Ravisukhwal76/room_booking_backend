const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ravisukhwal949:IkDVQOKEw5FbWEQz@cluster.w210yhf.mongodb.net/roomBookingApp?retryWrites=true&w=majority&appName=Cluster",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Room Schema and Model
const roomSchema = new mongoose.Schema({
  name: String,
  bookings: [{ date: String, timeSlot: String, bookedBy: String }],
});

const Room = mongoose.model("Room", roomSchema);

// Generate a session ID and token
app.get("/generate-session", (req, res) => {
  const sessionId = uuidv4();
  const token = jwt.sign({ sessionId }, "your_secret_key", { expiresIn: "1h" });
  res.json({ sessionId, token });
});

// Get all rooms
app.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
});

// Search rooms by name
app.get("/rooms/search", async (req, res) => {
  const { query } = req.query;
  try {
    const rooms = await Room.find({ name: new RegExp(query, "i") });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error searching rooms", error });
  }
});

// Book a room
app.post("/rooms/:roomId/book", async (req, res) => {
  const { roomId } = req.params;
  const { date, timeSlot, bookedBy } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the time slot is already booked
    const isBooked = room.bookings.some(
      (booking) => booking.date === date && booking.timeSlot === timeSlot
    );
    if (isBooked) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    room.bookings.push({ date, timeSlot, bookedBy });
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error booking room", error });
  }
});

// Get room details with current month's availability
app.get("/rooms/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room details", error });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
