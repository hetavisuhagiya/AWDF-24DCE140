const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Task = require("./models/Task");
const cache = require("./cache");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());


// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });


// HOME ROUTE
app.get("/", (req, res) => {
    res.json({
        message: "Practical 9 - In-Memory Caching API"
    });
});


// GET ALL TASKS
app.get("/tasks", async (req, res) => {
    try {

        // Check cache first
        //const cachedTasks = cache.get("all_tasks");
//
  //      if (cachedTasks) {
    //        console.log("CACHE HIT");
//
  //          return res.json(cachedTasks);
    //    }

        console.log("CACHE MISS");

        // If data is not in cache, get it from MongoDB
        const tasks = await Task.find();

        // Store result in cache
        cache.set("all_tasks", tasks);

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// GET SINGLE TASK
app.get("/tasks/:id", async (req, res) => {
    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// CREATE TASK
app.post("/tasks", async (req, res) => {
    try {

        const task = await Task.create(req.body);

        // Invalidate cache after adding task
        cache.del("all_tasks");

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {
    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Invalidate cache after update
        cache.del("all_tasks");

        res.json(task);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Invalidate cache after delete
        cache.del("all_tasks");

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});