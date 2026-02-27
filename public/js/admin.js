// ===============================
// CONFIG
// ===============================
const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// ===============================
// DOM
// ===============================
const productsContainer = document.getElementById("admin-products");
const ordersContainer = document.getElementById("admin-orders");

// ===============================
// VALIDAR TOKEN
// ===============================
if (!token) {
  alert("No autorizado. Inicia sesión.");
  window.location.href = "/login.html";
}

// ===============================
// CARGAR PRODUCTOS (ADMIN)
// ===============================
async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const productos = await res.json();

    if (!Array.isArray(productos)) {
      productsContainer.innerHTML =
        "<tr><td colspan='5'>Error cargando productos</td></tr>";
      return;
    }

    productsContainer.innerHTML = "";

    productos.forEach(p => {
      productsContainer.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>$${p.precio}</td>
          <td>${p.existencias}</td>
          <td>${p.category || "Sin categoría"}</td>
          <td>
            <button class="btn btn-edit"
              onclick="editarProducto(
                '${p._id}',
                '${p.nombre}',
                ${p.precio},
                ${p.existencias},
                '${p.category || ""}'
              )">
              Editar
            </button>

            <button class="btn btn-delete"
              onclick="eliminarProducto('${p._id}')">
              Eliminar
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// ===============================
// CREAR PRODUCTO
// ===============================
async function crearProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value;
  const existencias = document.getElementById("existencias").value;
  const category = document.getElementById("category").value;

  if (!nombre || !precio || !existencias || !category) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre,
        precio: Number(precio),
        existencias: Number(existencias),
        category
      })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Error creando producto");
      return;
    }

    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("existencias").value = "";
    document.getElementById("category").value = "";

    cargarProductos();

  } catch (error) {
    console.error("Error creando producto:", error);
  }
}

// ===============================
// EDITAR PRODUCTO
// ===============================
async function editarProducto(id, nombre, precio, existencias, category) {
  const nuevoNombre = prompt("Nombre:", nombre);
  const nuevoPrecio = prompt("Precio:", precio);
  const nuevoStock = prompt("Stock:", existencias);
  const nuevaCategoria = prompt("Categoría:", category);

  if (
    nuevoNombre === null ||
    nuevoPrecio === null ||
    nuevoStock === null ||
    nuevaCategoria === null
  ) return;

  try {
    await fetch(`${API_URL}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        precio: Number(nuevoPrecio),
        existencias: Number(nuevoStock),
        category: nuevaCategoria
      })
    });

    cargarProductos();

  } catch (error) {
    console.error("Error editando producto:", error);
  }
}

// ===============================
// ELIMINAR PRODUCTO
// ===============================
async function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  try {
    await fetch(`${API_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    cargarProductos();

  } catch (error) {
    console.error("Error eliminando producto:", error);
  }
}

// ===============================
// CARGAR ÓRDENES
// ===============================
async function cargarOrdenes() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    const orders = await res.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      ordersContainer.innerHTML =
        "<tr><td colspan='3'>Sin órdenes</td></tr>";
      return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach(o => {
      ordersContainer.innerHTML += `
        <tr>
          <td>Cliente Web / WhatsApp</td>
          <td>$${o.totalAmount}</td>
          <td>${new Date(o.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Error cargando órdenes:", error);
  }
}

// ===============================
// INIT
// ===============================
cargarProductos();
cargarOrdenes();