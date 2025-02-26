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
const authMiddleware = require('./middleware/authMiddleware');

console.log(encodedPassword);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${encodedPassword}@chatcluster.ttw8f.mongodb.net/?retryWrites=true&w=majority&appName=ChatCluster`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

// Define DB schemas

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

const MessageSchema = new mongoose.Schema({
  chatId: String,
  sender: String,
  text: String,
  timestamp: { type: Date, default: Date.now() }
})

const Message = mongoose.model("Message", MessageSchema);

const ChatSchema = new mongoose.Schema({
  users: [String], // Store user IDs of participants
  lastMessage: { type: String, default: "" }, // Store last message
  updatedAt: { type: Date, default: Date.now } // Track last activity
});

const Chat = new mongoose.model("Chat", ChatSchema);

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

// To fetch Chat based on userId
app.get('/chats/:userId', async (req,res) => {
  try {
    const chats = await Chat.find({ users: req.params.userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching chats' });
  }
})

// To fetch chat messages
app.post('/chats',authMiddleware, async (req,res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  try{

    // Check if chat already exists
    let chat = await Chat.findOne({ users: { $all: [currentUserId, userId]}});
    console.log(chat);
    // If no chats available
    if(!chat){
      chat = new Chat({ users: [currentUserId, userId] });
      await chat.save();
    }
    
    res.json({ chatId: chat._id });
  } catch (err) {
    console.log('Error finding or creating chat');
  }
})

// To fetch all users
app.get('/users', async (req,res) => {
  try{
    const users = await User.find({}, 'email _id');
    res.json(users);
  } catch(err) {
    res.status(500).json({error: err})
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

  // When user sends message
  socket.on("sendMessage", async ({chatId, sender, text}) => {
    const message = new Message({chatId, sender, text});
    await message.save();
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Broadcast message
    io.emit("updateChatList", { chatId, lastMessage: text})
  });

  // When user opens chat
  socket.on("fetchMessages", async (chatId) => {
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    socket.emit("loadMessage", messages);
  })

  // When user leaves
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
