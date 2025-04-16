import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
// Routes
import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import PostRoute from './routes/PostRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import MessageRoute from './routes/MessageRoute.js';

// Initialize app and load .env
const app = express();
dotenv.config(); // ✅ Use ESM-style (no require())

// Debug check for environment variables
console.log("MongoDB URL:", process.env.MONGO_URL);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // All needed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true // If using cookies/sessions
}));
app.use(express.static('public')); // Serve static files from 'public' folder
app.use('/images', express.static('images')); // Serve static files from 'images' folder

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database connection
const PORT = process.env.PORT || 5000; // Fallback port
const CONNECTION = process.env.MONGODB_CONNECTION || process.env.MONGO_URL; // Support both variable names
mongoose.connect(CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('MongoDB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});
// Routes
app.use('/auth', AuthRoute); // Authentication routes
app.use('/user', UserRoute); // User management routes
app.use('/posts', PostRoute); // Post-related routes
app.use('/upload', UploadRoute); // File upload routes
app.use('/chat', ChatRoute); // Chat routes
app.use('/message', MessageRoute); // Message routes