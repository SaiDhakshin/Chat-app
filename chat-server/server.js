const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);

console.log(encodedPassword);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${encodedPassword}@chatcluster.ttw8f.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


// Sign up process

app.post('/signup', async (req,res) => {
  const { email , password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email: email, password: hashedPassword });
  await user.save();
  res.json({ token: generateToken(user), user })
})

// login process

app.post('/login', async (req,res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });

  if(!user || !(bcrypt.compare(password, user.password))){
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ token: generateToken(user), user})
})

// Profile based protected route

app.get('/profile', async (req,res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if(!token){
    res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({user}); 
  } catch(err) {
    res.status(401).json({ error: 'Invalid token' });
  }
})

// Socket Defined here

const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins (change in production)
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Broadcast message
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
