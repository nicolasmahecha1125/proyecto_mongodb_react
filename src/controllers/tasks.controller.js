import Task from "../models/task.model.js";

// Obtener todas las tareas del usuario autenticado
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tareas", error: error.message });
  }
};

// Crear una nueva tarea
export const createTask = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    const newTask = new Task({
      title,
      description,
      date,
      user: req.user.id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("❌ Error en createTask:", error.message);
    res.status(500).json({ message: "Error creando tarea", error: error.message });
  }
};

// Obtener una tarea por ID (solo si pertenece al usuario)
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("user");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para ver esta tarea" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener tarea", error: error.message });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta tarea" });
    }

    await task.deleteOne();
    res.sendStatus(204); // ✅ No content
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar tarea", error: error.message });
  }
};

// Actualizar tarea (solo si pertenece al usuario)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar esta tarea" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar tarea", error: error.message });
  }
};
