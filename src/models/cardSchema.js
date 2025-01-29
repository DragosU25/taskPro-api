const mongoose = require("mongoose");

// Schema pentru card
const CardSchema = new mongoose.Schema({
  cardName: {
    type: String,
    required: true,
  },
  cardDescription: {
    type: String,
    required: true,
  },
  cardPriority: {
    type: String,
    enum: ["Without", "Low", "Medium", "High"],
    default: "Without",
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  columnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Column",
    required: true,
  },
});

module.exports = mongoose.model("Card", CardSchema);
