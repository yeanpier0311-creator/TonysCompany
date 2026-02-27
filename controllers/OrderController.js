const Order = require("../models/Order");

// ===============================
// CREAR ORDEN
// ===============================
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "La orden no tiene productos"
      });
    }

    // 🔒 Normalizar items (seguridad)
    const normalizedItems = items.map(item => ({
      product: item.product || null,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    // ✅ CALCULAR TOTAL CORRECTAMENTE
    const totalAmount = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      items: normalizedItems,
      totalAmount
    });

    await order.save();

    res.status(201).json(order);

  } catch (error) {
    console.error("❌ Error creando orden:", error);
    res.status(500).json({
      message: "Error al crear la orden"
    });
  }
};

// ===============================
// OBTENER ÓRDENES (ADMIN)
// ===============================
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    console.error("❌ Error obteniendo órdenes:", error);
    res.status(500).json({
      message: "Error al obtener órdenes"
    });
  }
};

// ===============================
// ACTUALIZAR ESTADO DE ORDEN
// ===============================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "shipped", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Estado no válido"
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Orden no encontrada"
      });
    }

    res.json(order);

  } catch (error) {
    console.error("❌ Error actualizando estado:", error);
    res.status(500).json({
      message: "Error actualizando estado"
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus
};