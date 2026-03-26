const task = require("../MODELS/task");

// CREATE
exports.createTask = async (req, res) => {
    try {
        const { title, description, taskStatus, priority, dueDate } = req.body;
        const userId = req.user.id;

        const t = await task.create({
            title,
            description,
            taskStatus,
            priority,
            dueDate,
            userId
        });

        res.status(201).json(t);
    } catch (error) {
        res.status(500).json({ message: "SERVER ERROR" });
    }
};

// GET WITH FILTER + SEARCH
exports.getTask = async (req, res) => {
    try {
        const userId = req.user.id;

        const { taskStatus, priority, search, page = 1, limit = 6, sort } = req.query;

        let filter = { userId };

        if (taskStatus) filter.taskStatus = taskStatus;
        if (priority) filter.priority = priority;

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;

        let sortOption = {};
        if (sort === "dueDate") sortOption.dueDate = 1;
        if (sort === "priority") sortOption.priority = 1;

        const tasks = await task.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await task.countDocuments(filter);

        res.json({
            tasks,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// UPDATE
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const t = await task.findById(id);

        if (!t) return res.status(404).json({ message: "Task not found" });

        if (t.userId.toString() !== userId)
            return res.status(403).json({ message: "Unauthorized" });

        const updatedTask = await task.findByIdAndUpdate(id, req.body, { new: true });

        res.json(updatedTask);

    } catch (error) {
        res.status(500).json({ message: "SERVER ERROR" });
    }
};

// DELETE
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const t = await task.findById(id);

        if (!t) return res.status(404).json({ message: "Task not found" });

        if (t.userId.toString() !== userId)
            return res.status(403).json({ message: "Unauthorized" });

        await task.findByIdAndDelete(id);

        res.json({ message: "Task deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ANALYTICS (FIXED)
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalTasks = await task.countDocuments({ userId });

        const completedTasks = await task.countDocuments({
            userId,
            taskStatus: "Done"
        });

        const pendingTasks = await task.countDocuments({
            userId,
            taskStatus: { $ne: "Done" }
        });

        const completionRate =
            totalTasks === 0
                ? 0
                : ((completedTasks / totalTasks) * 100).toFixed(2);

        res.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            completionRate: `${completionRate}%`
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};