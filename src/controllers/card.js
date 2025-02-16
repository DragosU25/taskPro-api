const cardService = require("../services/card");

class CardController {
  async createCard(req, res) {
    try {
      const { columnId } = req.params;
      const { cardName, cardDescription, cardPriority, deadlineDate } =
        req.body;

      const newCard = await cardService.createCard(columnId, {
        cardName,
        cardDescription,
        cardPriority,
        deadlineDate: deadlineDate ? new Date(deadlineDate) : undefined,
      });

      res.status(201).json({
        success: true,
        data: newCard,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCards(req, res) {
    try {
      const { columnId } = req.params;
      const cards = await cardService.getCards(columnId);

      res.status(200).json({
        success: true,
        data: cards,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async editCard(req, res) {
    try {
      const { columnId, cardId } = req.params;
      const allowedFields = [
        "cardName",
        "cardDescription",
        "cardPriority",
        "deadlineDate",
      ];

      const updateData = Object.keys(req.body)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      if (updateData.deadlineDate) {
        updateData.deadlineDate = new Date(updateData.deadlineDate);
      }

      const updatedCard = await cardService.editCard(
        columnId,
        cardId,
        updateData
      );

      res.status(200).json({
        success: true,
        data: updatedCard,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async moveCard(req, res) {
    try {
      // Schimbăm să luăm din params în loc de body
      const { fromColumnId, cardId, toColumnId } = req.params;

      console.log("Move Card Parameters:", {
        fromColumnId,
        cardId,
        toColumnId,
      });

      if (!cardId || !fromColumnId || !toColumnId) {
        return res.status(400).json({
          success: false,
          message: `Missing parameters: ${!cardId ? "cardId " : ""}${
            !fromColumnId ? "fromColumnId " : ""
          }${!toColumnId ? "toColumnId" : ""}`,
        });
      }

      const result = await cardService.moveCard(
        cardId,
        fromColumnId,
        toColumnId
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Move Card Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteCard(req, res) {
    try {
      const { columnId, cardId } = req.params;
      const result = await cardService.deleteCard(columnId, cardId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CardController();
