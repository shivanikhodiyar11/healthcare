const mongoose = require("mongoose");
const { Schema } = mongoose;
const tokenValidity = () => new Date(new Date().getTime() + 48 * 3600 * 1000);

const tokenSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    token: { type: String, required: true },
    validTill: {
      type: Date,
      required: true,
      default: tokenValidity,
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);
module.exports = { Token, tokenValidity };
