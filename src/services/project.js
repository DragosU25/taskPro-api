const User = require("../models/userSchema");
const Project = require("../models/projectSchema");
const mongoose = require("mongoose");

exports.createProjectForUser = async (userId, { name, icon, background }) => {
  // Verifică dacă utilizatorul există
  const user = await User.findById(userId);
  console.log(user);
  if (!user) throw new Error("User not found");

  // Creează un proiect nou
  const newProject = new Project({ name, icon, background });

  // Salvează proiectul în baza de date
  const savedProject = await newProject.save();

  // Adaugă proiectul la utilizator
  user.projects.push(savedProject._id);
  await user.save();

  return savedProject;
};
exports.getUserWithProjects = async (userId) => {
  // Găsește utilizatorul și populează detaliile proiectelor
  const user = await User.findById(userId).populate("projects");
  if (!user) throw new Error("User not found");

  return user;
};

exports.editProject = async (projectId, updateData) => {
  console.log("Checking Project ID:", projectId);

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  Object.keys(updateData).forEach((key) => {
    project[key] = updateData[key];
  });

  await project.save();

  return project;
};

exports.deleteProject = async (userId, projectId) => {
  // Verificăm dacă proiectul aparține utilizatorului
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.projects.includes(projectId)) {
    throw new Error("Project does not belong to this user");
  }

  // Ștergem proiectul
  await Project.findByIdAndDelete(projectId);

  // Eliminăm proiectul din lista de proiecte a utilizatorului
  user.projects = user.projects.filter((id) => id.toString() !== projectId);
  await user.save();

  return { success: true, message: "Project deleted successfully" };
};
