const mongoose = require("mongoose");

const Column = require("./columnSchema");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    enum: ["1", "2", "3", "4", "5", "6", "7", "8", "default"],
    default: "default",
  },
  background: {
    type: String,
    enum: [
      "bg1",
      "bg2",
      "bg3",
      "bg4",
      "bg5",
      "bg6",
      "bg7",
      "bg8",
      "bg9",
      "bg10",
      "bg11",
      "bg12",
      "bg13",
      "bg14",
      "bg15",
      "default",
    ],
    default: "default",
  },
  projectColumns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column", // Referință la schema Column
    },
  ],
});

module.exports = mongoose.model("Project", ProjectSchema);
