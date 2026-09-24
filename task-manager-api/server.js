const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Task = require("./models/Task");
const User = require("./models/User");
const authenticate = require("./middleware/auth");

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in the .env file");
}

// Parse JSON
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Content-Type Validation Middleware
app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    return res.status(400).json({
      error: "Content-Type must be application/json",
    });
  }
  next();
});

function validateCredentials(req, res, next) {
  const { email, password } = req.body;
  const validEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPassword = typeof password === "string" && password.length >= 6;

  if (!validEmail || !validPassword) {
    return res.status(400).json({
      message: "A valid email and password of at least 6 characters are required",
    });
  }
  next();
}

app.post("/auth/register", validateCredentials, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email is already registered" });

    const password = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ email, password });
    res.status(201).json({ id: user._id, email: user.email });
  } catch (err) {
    next(err);
  }
});

app.post("/auth/login", validateCredentials, async (req, res, next) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    const passwordMatches = user && await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatches) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

app.get("/auth/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("email createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ======================
// GET ALL TASKS
// ======================
app.get("/tasks", authenticate, async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// ======================
// GET TASK BY ID
// ======================
app.get("/tasks/:id", authenticate, async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ======================
// CREATE TASK
// ======================
app.post("/tasks", authenticate, async (req, res, next) => {
  try {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// ======================
// UPDATE TASK
// ======================
app.put("/tasks/:id", authenticate, async (req, res, next) => {
  try {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }
    const task = await Task.findByIdAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, user: req.user.id },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ======================
// DELETE TASK
// ======================
app.delete("/tasks/:id", authenticate, async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task Deleted Successfully",
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ======================
// Global Error Handler
// ======================
app.use((err, req, res, next) => {
  console.error(err);

  // Validation Error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// ======================
// Start Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});