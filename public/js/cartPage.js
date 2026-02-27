const API_URL = "http://localhost:5000/api";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// ===============================
// RENDER CARRITO
// ===============================
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty'>El carrito está vacío</p>";
    cartTotal.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="card">
        <h4>${item.name}</h4>
        <p class="price">$${item.price}</p>

        <div class="actions">
          <button onclick="decrease(${index})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increase(${index})">+</button>
          <button onclick="removeItem(${index})">🗑</button>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = `Total: $${total}`;
}

// ===============================
// ACCIONES
// ===============================
function increase(index) {
  cart[index].quantity++;
  save();
}

function decrease(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  save();
}

function removeItem(index) {
  cart.splice(index, 1);
  save();
}

function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ===============================
// ENVIAR ORDEN AL BACKEND
// ===============================
async function sendWhatsApp() {
  if (cart.length === 0) {
    alert("Carrito vacío");
    return;
  }

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: cart
    })
  });

  if (!res.ok) {
    alert("Error creando la orden");
    return;
  }

  localStorage.removeItem("cart");
  alert("Pedido enviado correctamente");

  window.location.href = "index.html";
}

// INIT
renderCart();