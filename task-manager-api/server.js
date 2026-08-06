const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${new Date().toLocaleString()}`);
    next();
});

let tasks = [
    { id: 1, title: "Learn React" },
    { id: 2, title: "Learn Express" }
];

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
    const task = {
        id: tasks.length + 1,
        title: req.body.title
    };

    tasks.push(task);

    res.status(201).json(task);
});

app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task Not Found" });
    }

    task.title = req.body.title;

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    res.status(200).json({
        message: "Task Deleted Successfully"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Something went wrong"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});