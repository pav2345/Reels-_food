const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodpartner",
      required: true,
    },

    
    likes: {
      type: Number,
      default: 0,
    },

    
    saves: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;
