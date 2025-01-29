const mongoose = require("mongoose");
const Project = require("../models/projectSchema");
const Column = require("../models/columnSchema");

exports.addColumnToProject = async (projectId, columnData) => {
  // Verifică dacă projectId este valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID.");
  }

  // Găsește proiectul după ID
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found.");
  }

  // Creează o nouă coloană
  const newColumn = new Column(columnData);

  await newColumn.save();

  // Adaugă noua coloană în lista de coloane ale proiectului
  if (!project.projectColumns) {
    project.projectColumns = [];
  }
  project.projectColumns.push(newColumn._id);

  // Salvează proiectul actualizat
  await project.save();

  // Populează datele pentru proiect (inclusiv coloanele)
  const populatedProject = await Project.findById(projectId).populate(
    "projectColumns"
  );

  return populatedProject;
};

// Editare coloană
exports.editColumn = async (columnId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(columnId)) {
    throw new Error("Invalid column ID.");
  }

  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Column not found.");
  }
  console.log(updateData);
  // Actualizăm câmpurile necesare
  Object.keys(updateData).forEach((key) => {
    column[key] = updateData[key];
  });

  await column.save();
  return column;
};

exports.getColumns = async (projectId) => {
  // Verifică dacă projectId este valid
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new Error("Invalid project ID.");
  }

  // Găsește proiectul și populează coloanele
  const project = await Project.findById(projectId).populate("projectColumns");

  if (!project) {
    throw new Error("Project not found.");
  }

  // Returnează coloanele populate
  return project.projectColumns;
};

exports.deleteColumn = async (columnId) => {
  try {
    // Șterge coloana specificată
    const deletedColumn = await Column.findByIdAndDelete(columnId);

    if (!deletedColumn) {
      throw new Error("Column not found.");
    }

    return deletedColumn;
  } catch (error) {
    console.error("Error in deleteColumn service:", error);
    throw error;
  }
};
