const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ===============================
// CREAR ORDEN
// ===============================
router.post("/", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Orden vacía" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      items,
      totalAmount
    });

    await order.save();
    res.status(201).json(order);

  } catch (error) {
    console.error("Error creando orden:", error);
    res.status(500).json({ message: "Error creando orden" });
  }
});

// ===============================
// OBTENER ÓRDENES
// ===============================
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;