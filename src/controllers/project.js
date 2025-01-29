const projectService = require("../services/project");
const mongoose = require("mongoose");

exports.createProjectForUser = async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authentication middleware

    const { name, icon, background } = req.body;

    // Call service logic
    const project = await projectService.createProjectForUser(userId, {
      name,
      icon,
      background,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getUserWithProjects = async (req, res) => {
  try {
    const userId = req.user._id; // Preia utilizatorul curent din middleware-ul de autentificare
    const user = await projectService.getUserWithProjects(userId);

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.editProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validare rapidă pentru ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid project ID" });
    }

    const updateData = req.body;

    // Apelează logica din service pentru a actualiza proiectul
    const updatedProject = await projectService.editProject(
      projectId, // ID-ul proiectului
      updateData // Datele care trebuie actualizate
    );

    return res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    console.error("Error in editing project:", error); // Log pentru debugging
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user._id; // ID-ul utilizatorului autentificat
    const { projectId } = req.params; // ID-ul proiectului

    const result = await projectService.deleteProject(userId, projectId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
