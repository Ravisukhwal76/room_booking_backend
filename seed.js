const mongoose = require("mongoose");
const Room = require("./modals/Room");

// MongoDB connection string (update with your credentials)
const MONGODB_URI =
  "mongodb+srv://ravisukhwal949:IkDVQOKEw5FbWEQz@cluster.w210yhf.mongodb.net/roomBookingApp?retryWrites=true&w=majority&appName=Cluster";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    seedDatabase();
  })
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Define default rooms
    const defaultRooms = [
      { name: "Conference Room 1", bookings: [] },
      { name: "Meeting Room A", bookings: [] },
      { name: "Auditorium", bookings: [] },
      { name: "Training Room", bookings: [] },
      { name: "Workshop Room", bookings: [] },
    ];

    // Clear existing rooms
    await Room.deleteMany({});

    // Insert default rooms
    await Room.insertMany(defaultRooms);

    console.log("Database seeded with default rooms!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database", err);
  }
};
