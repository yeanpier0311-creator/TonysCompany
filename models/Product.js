const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: String,
  category: {
    type: String,
    enum: ["Tecnología", "Electrodomésticos", "Línea Blanca"],
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);