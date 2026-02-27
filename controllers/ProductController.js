const Product = require("../models/Product");

// ===============================
// CREAR PRODUCTO
// ===============================
exports.createProduct = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      existencias,
      image,
      category
    } = req.body;

    if (!nombre || !precio || !existencias || !category) {
      return res.status(400).json({
        message: "Faltan campos obligatorios"
      });
    }

    const product = new Product({
      nombre,
      descripcion,
      precio,
      existencias,
      image,
      category
    });

    await product.save();

    res.status(201).json(product);

  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({
      message: "Error al crear producto"
    });
  }
};

// ===============================
// OBTENER TODOS LOS PRODUCTOS
// ===============================
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// ===============================
// OBTENER PRODUCTO POR ID
// ===============================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// ===============================
// ACTUALIZAR PRODUCTO
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({
      message: "Producto actualizado",
      product
    });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// ===============================
// ACTUALIZAR STOCK
// ===============================
exports.updateStock = async (req, res) => {
  try {
    const { existencias } = req.body;

    if (isNaN(existencias)) {
      return res.status(400).json({ message: "Stock inválido" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.existencias = Number(existencias);
    await product.save();

    res.json({
      message: "Stock actualizado correctamente",
      product
    });

  } catch (error) {
    res.status(500).json({
      message: "Error actualizando stock"
    });
  }
};

// ===============================
// ELIMINAR PRODUCTO
// ===============================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};