const mongoose = require("mongoose");
const Card = require("./cardSchema");

const ColumnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // De exemplu: "To Do", "In Progress", "Done"
  },
  columnCards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
});

module.exports = mongoose.model("Column", ColumnSchema);
