const express = require("express");
const columnController = require("../controllers/column");
const cardRouters = require("./card");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Adăugare coloană într-un proiect specific
router.post("/:projectId", columnController.addColumn);
router.get("/:projectId", columnController.getColumns);
// Editare coloană într-un proiect specific
router.patch("/:columnId", columnController.editColumn);
router.use("/cards", authMiddleware, cardRouters);
router.delete("/:columnId", columnController.deleteColumn);

module.exports = router;
