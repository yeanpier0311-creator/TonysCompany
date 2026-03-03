const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  precio: { type: Number, required: true },
  existencias: { type: Number, default: 0 },
  image: { type: String, default: "" },
  brand: { type: String, default: "" },
  category: { type: String, default: "" },
  subcategory: { type: String, default: "" },
  specs: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
