const Column = require("../models/columnSchema");
const mongoose = require("mongoose");
const Card = require("../models/cardSchema"); // Asigură-te că importi schema pentru Card

exports.createCard = async (
  columnId,
  { cardName, cardDescription, cardPriority, deadlineDate }
) => {
  // Verifică validitatea ObjectId pentru columnId
  if (!mongoose.Types.ObjectId.isValid(columnId)) {
    throw new Error("Invalid column ID");
  }

  // Căutăm coloana în baza de date
  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Column not found");
  }

  // Creăm un nou card cu columnId
  const newCard = new Card({
    cardName,
    cardDescription,
    cardPriority,
    deadlineDate,
    columnId, // Include columnId în documentul cardului
  });

  console.log("recived data", newCard);
  // Salvăm cardul în colecția Card
  await newCard.save();

  // Adăugăm ID-ul cardului la array-ul columnCards al coloanei
  column.columnCards.push(newCard._id);

  // Salvăm coloana actualizată
  await column.save();

  return newCard; // Returnăm cardul nou creat
};

exports.getCards = async (columnId) => {
  // Verifică validitatea ObjectId pentru columnId
  if (!mongoose.Types.ObjectId.isValid(columnId)) {
    throw new Error("Invalid column ID");
  }

  // Găsește toate cardurile asociate cu columnId
  const cards = await Card.find({ columnId });

  return cards; // Returnează toate cardurile pentru această coloană
};

exports.editCard = async (columnId, cardId, updateData) => {
  // Verifică validitatea ObjectId pentru projectId și cardId
  if (
    !mongoose.Types.ObjectId.isValid(columnId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    throw new Error("Invalid project or card ID");
  }

  // Căutăm proiectul în baza de date și populăm cardurile
  const column = await Column.findById(columnId).populate("columnCards");
  if (!column) {
    throw new Error("Project not found");
  }

  // Găsim cardul din array-ul projectCard folosind ID-ul cardului
  const card = column.columnCards.find(
    (card) => card._id.toString() === cardId
  );
  if (!card) {
    throw new Error("Card not found");
  }

  // Actualizăm doar câmpurile care sunt incluse în updateData
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] !== undefined) {
      card[key] = updateData[key];
    }
  });
  console.log("updated data", updateData);
  // Salvăm proiectul cu cardul actualizat
  await column.save();

  // Returnăm cardul actualizat
  return card;
};

exports.moveCard = async (cardId, fromColumnId, toColumnId) => {
  try {
    const fromColumn = await Column.findById(fromColumnId);
    const toColumn = await Column.findById(toColumnId);

    console.log("🔍 Checking columns...");
    console.log("From Column:", fromColumn);
    console.log("To Column:", toColumn);
    console.log("Cards in fromColumn:", fromColumn.columnCards);

    // Verificăm dacă există coloanele
    if (!fromColumn || !toColumn) {
      return {
        success: false,
        status: 404,
        message: "One or both columns not found",
      };
    }

    // Verificăm dacă cardul există în coloana sursă
    if (!fromColumn.columnCards.includes(cardId)) {
      return {
        success: false,
        status: 404,
        message: "Card not found in the source column",
      };
    }

    // Eliminăm cardul din coloana sursă
    fromColumn.columnCards = fromColumn.columnCards.filter(
      (id) => id.toString() !== cardId
    );

    // Adăugăm cardul în coloana de destinație
    toColumn.columnCards.push(cardId);

    // Salvăm modificările în baza de date
    await fromColumn.save();
    await toColumn.save();

    return {
      data: {
        fromColumnId,
        toColumnId,
        cardId,
      },
      success: true,
      message: "Card moved successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteCard = async (columnId, cardId) => {
  // Verifică validitatea ObjectId pentru projectId și cardId
  if (
    !mongoose.Types.ObjectId.isValid(columnId) ||
    !mongoose.Types.ObjectId.isValid(cardId)
  ) {
    throw new Error("Invalid project or card ID");
  }

  console.log(columnId, cardId);

  // Căutăm proiectul în baza de date
  const column = await Column.findById(columnId);
  if (!column) {
    throw new Error("Project not found");
  }

  // Căutăm cardul în array-ul projectCard folosind cardId
  const cardIndex = column.columnCards.findIndex(
    (card) => card.toString() === cardId
  );

  if (cardIndex === -1) {
    throw new Error("Card not found");
  }

  // Ștergem cardul din array-ul projectCard
  const deletedCard = column.columnCards.splice(cardIndex, 1)[0];

  // Salvăm proiectul după ce am șters cardul
  await column.save();
  const columnCards = column.columnCards;

  // Returnăm cardul șters
  return { deletedCard, columnCards };
};
