import Task from "../models/Task.js";

export const getTasks = async (req, res, next) => {
  try {
    let tasks = [];
    if (req.user?._id) {
      tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    }

    if (tasks.length === 0) {
      tasks = [
        {
          _id: "task_001",
          id: "task_001",
          title: "Read Chapter 4: Neural Networks",
          description: "Focus on backpropagation and activation functions.",
          subject: "Machine Learning",
          estimatedHours: 2,
          priority: "high",
          color: "#6366f1",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          completed: false,
        },
        {
          _id: "task_002",
          id: "task_002",
          title: "Solve Calculus Problem Set #5",
          description: "Integration by parts and trigonometric substitution.",
          subject: "Calculus",
          estimatedHours: 1.5,
          priority: "medium",
          color: "#06b6d4",
          dueDate: new Date(Date.now() + 172800000).toISOString(),
          completed: true,
        },
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        tasks,
        streak: { current: 7, longest: 14 },
        goal: { completedHours: 14.5, targetHours: 20 },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, subject, estimatedHours, priority, dueDate } = req.body;
    let newTask = null;

    if (req.user?._id) {
      newTask = await Task.create({
        user: req.user._id,
        title,
        description: description || "",
        subject: subject || "Study Task",
        estimatedHours: estimatedHours || 1,
        priority: priority || "medium",
        dueDate: dueDate || Date.now(),
      });
    }

    res.status(201).json({
      success: true,
      data: newTask || {
        id: Math.random().toString(36),
        title,
        description,
        subject,
        estimatedHours,
        priority,
        completed: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user?._id) {
      const task = await Task.findOne({ _id: id, user: req.user._id });
      if (task) {
        task.completed = !task.completed;
        await task.save();
      }
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user?._id) {
      await Task.findOneAndDelete({ _id: id, user: req.user._id });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
