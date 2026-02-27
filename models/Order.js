const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        id: String,        // id del producto
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);