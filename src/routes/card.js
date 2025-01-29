const express = require("express");
const cardController = require("../controllers/card");
const router = express.Router();

// Routes that involve card actions
router.post("/:columnId/addCard", cardController.createCard); // Create card in project
router.get("/:columnId/getCards", cardController.getCards); // Get all cards for a project
router.patch("/:columnId/editCard/:cardId", cardController.editCard); // Edit card in project
router.delete("/:columnId/deleteCard/:cardId", cardController.deleteCard); // Delete card from project
router.patch(
  "/:fromColumnId/moveCard/:cardId/:toColumnId",
  cardController.moveCard
);

module.exports = router;
