// ===============================
// CONFIG
// ===============================
const API_URL = "http://localhost:5000/api";
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===============================
// DOM
// ===============================
const container = document.getElementById("products-container");
const cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("search-input");

// ===============================
// DATA
// ===============================
let allProducts = [];

// ===============================
// CARGAR PRODUCTOS
// ===============================
async function loadProducts() {
  const res = await fetch(`${API_URL}/products`);
  allProducts = await res.json();
  renderProducts(allProducts);
}

// ===============================
// RENDER
// ===============================
function renderProducts(products) {
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML = "<p>No se encontraron productos</p>";
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image || 'https://via.placeholder.com/300x200'}">
        <h4>${p.nombre}</h4>
        <p class="price">$${p.precio}</p>
        <button onclick="addToCart('${p._id}', '${p.nombre}', ${p.precio})">
          Agregar al carrito
        <button onclick="addToCart(
  '${p._id}',
  '${p.nombre}',
  ${p.precio},
  '${p.category}'
)">
        </button>
      </div>
    `;
  });
}

// ===============================
// FILTRO POR CATEGORÍA
// ===============================
function filterCategory(category) {
  if (category === "Todos") {
    renderProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );

  renderProducts(filtered);
}

// ===============================
// BUSCADOR
// ===============================
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.nombre.toLowerCase().includes(value)
  );

  renderProducts(filtered);
});

// ===============================
// CARRITO
// ===============================
function addToCart(id, nombre, precio, category) {
  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      id,
      name: nombre,
      price: precio,
      category,      // 👈 AQUÍ
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((acc, p) => acc + p.quantity, 0);
}

// ===============================
// INIT
// ===============================
loadProducts();
updateCartCount();