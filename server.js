require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');

// Rutas
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// MIDDLEWARES
// --------------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --------------------
// CONEXIÓN A MONGODB
// --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado correctamente'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// --------------------
// MODELO PRODUCTO
// (Funciona, pero en un futuro debe ir a /models)
// --------------------
const Product = mongoose.model(
  'Product',
  new mongoose.Schema(
    {
      nombre: { type: String, required: true },
      precio: { type: Number, required: true },
      existencias: { type: Number, default: 0 },
      category: {
        type: String,
        enum: ['tecnologia', 'electrodomesticos', 'linea_blanca', ''],
        default: ''
      },
      image: { type: String, default: '' }
    },
    { timestamps: true }
  )
);

// --------------------
// MIDDLEWARE AUTH ADMIN
// --------------------
function authAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(403).json({ mensaje: 'Token requerido' });
  }

  const token = header.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

// --------------------
// LOGIN ADMIN
// --------------------
app.post('/api/login', (req, res) => {
  const { usuario, clave } = req.body;

  if (
    usuario === process.env.ADMIN_USER &&
    clave === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  }

  return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
});

// --------------------
// PRODUCTOS (PÚBLICO)
// --------------------
app.get('/api/products', async (req, res) => {
  const productos = await Product.find();
  res.json(productos);
});

// --------------------
// PRODUCTOS (ADMIN)
// --------------------
app.get('/api/admin/products', authAdmin, async (req, res) => {
  const productos = await Product.find();
  res.json(productos);
});

app.post('/api/admin/products', authAdmin, async (req, res) => {
  const { nombre, precio, existencias, category, image } = req.body;

  const nuevoProducto = new Product({
    nombre,
    precio,
    existencias: existencias || 0,
    category: category || '',
    image: image || ''
  });

  await nuevoProducto.save();
  res.json({ mensaje: 'Producto creado', producto: nuevoProducto });
});

app.put('/api/admin/products/:id', authAdmin, async (req, res) => {
  const { nombre, precio, existencias, category, image } = req.body;

  await Product.findByIdAndUpdate(req.params.id, {
    nombre,
    precio,
    existencias: existencias || 0,
    category: category || '',
    image: image || ''
  });

  res.json({ mensaje: 'Producto actualizado' });
});

app.delete('/api/admin/products/:id', authAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
});

// --------------------
// RUTAS DE ÓRDENES
// --------------------
app.use("/api/orders", orderRoutes);

// --------------------
// SERVIDOR
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});