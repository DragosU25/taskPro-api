const cardService = require("../services/card");

exports.createCard = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { cardName, cardDescription, cardPriority, deadlineDate } = req.body; // Extrage datele cardului

    console.log("Request Params:", req.params); // Log pentru debugging (optional)

    // Apelează funcția de service pentru a crea cardul
    const newCard = await cardService.createCard(columnId, {
      cardName,
      cardDescription,
      cardPriority,
      deadlineDate,
    });
    console.log("recived data", newCard);

    return res.status(201).json({ success: true, data: newCard });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCards = async (req, res) => {
  try {
    const { columnId } = req.params; // Get projectId from params

    // Apelăm funcția din service care se ocupă cu populația cardurilor
    const cards = await cardService.getCards(columnId);

    return res.status(200).json({ success: true, data: cards });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.editCard = async (req, res) => {
  try {
    const { columnId, cardId } = req.params;
    const updateData = req.body;

    // Verificăm că updateData conține doar câmpurile care pot fi actualizate
    const allowedFields = [
      "cardName",
      "cardDescription",
      "cardPriority",
      "deadlineDate",
    ];
    const filteredData = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    // Apelăm funcția din service pentru a edita cardul
    const updatedCard = await cardService.editCard(
      columnId,
      cardId,
      filteredData
    );

    console.log("updated card", updateData);

    // Returnăm cardul actualizat
    return res.status(200).json({ success: true, data: updatedCard });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.moveCard = async (req, res) => {
  try {
    const { cardId, fromColumnId, toColumnId } = req.params;

    console.log("➡️ Request received: ", { cardId, fromColumnId, toColumnId });

    const result = await cardService.moveCard(cardId, fromColumnId, toColumnId);

    if (!result.success) {
      return res
        .status(result.status)
        .json({ success: false, message: result.message });
    }

    res.status(200).json({
      success: true,
      message: "Card moved successfully",
      cardId,
      fromColumnId,
      toColumnId,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { columnId, cardId } = req.params;

    const deletedCard = await cardService.deleteCard(columnId, cardId);
    console.log(deletedCard);
    return res.status(200).json({ success: true, data: deletedCard });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
