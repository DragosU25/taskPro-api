const Card = require("../models/cardSchema");
const Column = require("../models/columnSchema");
const mongoose = require("mongoose");

class CardService {
  async createCard(columnId, cardData) {
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      throw new Error("Invalid column ID format");
    }

    const column = await Column.findById(columnId);
    if (!column) {
      throw new Error("Column not found");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newCard = new Card({
        ...cardData,
        columnId,
      });

      await newCard.save({ session });

      column.columnCards.push(newCard._id);
      await column.save({ session });

      await session.commitTransaction();
      return newCard;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getCards(columnId) {
    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      throw new Error("Invalid column ID format");
    }

    const cards = await Card.find({ columnId }).sort({ createdAt: -1 });

    return cards;
  }

  async editCard(columnId, cardId, updateData) {
    if (
      !mongoose.Types.ObjectId.isValid(columnId) ||
      !mongoose.Types.ObjectId.isValid(cardId)
    ) {
      throw new Error("Invalid ID format");
    }

    const card = await Card.findOne({
      _id: cardId,
      columnId: columnId,
    });

    if (!card) {
      throw new Error("Card not found");
    }

    Object.assign(card, updateData);
    await card.save();

    return card;
  }

  async moveCard(cardId, fromColumnId, toColumnId) {
    console.log("cardId:", cardId);
    console.log("formColumnId", fromColumnId);
    console.log("toColumnId", toColumnId);
    if (
      !mongoose.Types.ObjectId.isValid(cardId) ||
      !mongoose.Types.ObjectId.isValid(fromColumnId) ||
      !mongoose.Types.ObjectId.isValid(toColumnId)
    ) {
      throw new Error("Invalid ID format");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [card, fromColumn, toColumn] = await Promise.all([
        Card.findById(cardId),
        Column.findById(fromColumnId),
        Column.findById(toColumnId),
      ]);

      if (!card || !fromColumn || !toColumn) {
        throw new Error("Card or columns not found");
      }

      // Update card's column
      card.columnId = toColumnId;
      await card.save({ session });

      // Remove from source column
      fromColumn.columnCards = fromColumn.columnCards.filter(
        (id) => id.toString() !== cardId.toString()
      );
      await fromColumn.save({ session });

      // Add to destination column
      toColumn.columnCards.push(cardId);
      await toColumn.save({ session });

      await session.commitTransaction();

      return {
        fromColumn: await Column.findById(fromColumnId).populate("columnCards"),
        toColumn: await Column.findById(toColumnId).populate("columnCards"),
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteCard(columnId, cardId) {
    if (
      !mongoose.Types.ObjectId.isValid(columnId) ||
      !mongoose.Types.ObjectId.isValid(cardId)
    ) {
      throw new Error("Invalid ID format");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [card, column] = await Promise.all([
        Card.findOne({ _id: cardId, columnId }),
        Column.findById(columnId),
      ]);

      if (!card || !column) {
        throw new Error("Card or column not found");
      }

      await Card.deleteOne({ _id: cardId }, { session });

      column.columnCards = column.columnCards.filter(
        (id) => id.toString() !== cardId.toString()
      );
      await column.save({ session });

      await session.commitTransaction();

      return {
        deletedCardId: cardId,
        columnCards: column.columnCards,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = new CardService();
