const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock
} = require("../controllers/ProductController");

// 🔐 TODAS las rutas de admin protegidas
router.use(protect);

// ===============================
// CREAR PRODUCTO (ADMIN)
// POST /api/admin/products
// ===============================
router.post("/", createProduct);

// ===============================
// OBTENER TODOS LOS PRODUCTOS (ADMIN)
// GET /api/admin/products
// ===============================
router.get("/", getProducts);

// ===============================
// OBTENER PRODUCTO POR ID (ADMIN)
// GET /api/admin/products/:id
// ===============================
router.get("/:id", getProductById);

// ===============================
// ACTUALIZAR PRODUCTO COMPLETO (ADMIN)
// PUT /api/admin/products/:id
// ===============================
router.put("/:id", updateProduct);

// ===============================
// ACTUALIZAR SOLO STOCK (ADMIN)
// PATCH /api/admin/products/:id/stock
// ===============================
router.patch("/:id/stock", updateStock);

// ===============================
// ELIMINAR PRODUCTO (ADMIN)
// DELETE /api/admin/products/:id
// ===============================
router.delete("/:id", deleteProduct);

module.exports = router;