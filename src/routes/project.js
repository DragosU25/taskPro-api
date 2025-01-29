const express = require("express");
const projectController = require("../controllers/project");
const { authMiddleware } = require("../middlewares/authMiddleware");
const columnRoutes = require("./column");

const router = express.Router();

// Endpoint to create a project for a user
router.post(
  "/addProject",
  authMiddleware,
  projectController.createProjectForUser
);

// Endpoint to edit a project
router.patch("/:projectId", authMiddleware, projectController.editProject);

// Endpoint to get all projects for the user
router.get("/projects", authMiddleware, projectController.getUserWithProjects);

// Endpoint to delete a project
router.delete("/:projectId", authMiddleware, projectController.deleteProject);

// Routes related to cards within a specific project
router.use("/columns", authMiddleware, columnRoutes);

module.exports = router;
