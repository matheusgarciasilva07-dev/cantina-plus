/* =========================================================
   CANTINA+ — lógica do aplicativo
   ========================================================= */

// ---------------------- DADOS DO CARDÁPIO ----------------------
const MENU = [
  {
    id: 1,
    name: "Suco de Laranja",
    description: "Suco de laranja natural espremido na hora, gelado e sem conservantes",
    price: 8.0,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop&auto=format",
    badge: "🍊 NATURAL",
    rating: 4.9,
    time: "3 min",
  },
  {
    id: 2,
    name: "Esfiha de Carne",
    description: "Esfiha fechada recheada com carne moída bem temperada, quentinha",
    price: 8.0,
    category: "Salgados",
    image: "https://images.unsplash.com/photo-1653982960203-c8361d7bed96?w=400&h=300&fit=crop&auto=format",
    badge: "🔥 FAVORITO",
    rating: 4.8,
    time: "5 min",
  },
  {
    id: 3,
    name: "Esfiha Doce",
    description: "Esfiha doce recheada com chocolate ou doce de leite, irresistível!",
    price: 8.0,
    category: "Doces",
    image: "https://images.unsplash.com/photo-1564354273277-c6d4b8532100?w=400&h=300&fit=crop&auto=format",
    badge: "😍 DELÍCIA",
    rating: 4.9,
    time: "5 min",
  },
  {
    id: 4,
    name: "Pedaço de Bolo",
    description: "Fatia de bolo caseiro do dia — chocolate, laranja ou cenoura com cobertura",
    price: 8.0,
    category: "Doces",
    image: "https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=400&h=300&fit=crop&auto=format",
    rating: 4.8,
    time: "2 min",
  },
  {
    id: 5,
    name: "Salgado",
    description: "Salgado assado ou frito do dia — coxinha, risole, empada ou quibe",
    price: 8.0,
    category: "Salgados",
    image: "https://images.unsplash.com/photo-1641848421532-b27f3819071c?w=400&h=300&fit=crop&auto=format",
    badge: "⚡ QUENTINHO",
    rating: 4.7,
    time: "5 min",
  },
  {
    id: 6,
    name: "Doguinho",
    description: "Mini hot dog com salsicha, molho de tomate, mostarda e ketchup",
    price: 8.0,
    category: "Lanches",
    image: "https://images.unsplash.com/photo-1613482084286-41f25b486fa2?w=400&h=300&fit=crop&auto=format",
    badge: "🌭 HIT",
    rating: 4.9,
    time: "6 min",
  },
  {
    id: 7,
    name: "Salgadinho",
    description: "Pacotinho de salgadinho crocante — sabores variados: queijo, churrasco ou frango",
    price: 8.0,
    category: "Lanches",
    image: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400&h=300&fit=crop&auto=format",
    rating: 4.6,
    time: "1 min",
  },
  {
    id: 8,
    name: "Polvilho",
    description: "Biscoito de polvilho crocante e levinho, salgado ou doce. Pacote individual",
    price: 8.0,
    category: "Lanches",
    image: "https://images.unsplash.com/photo-1699666397768-0126340e880a?w=400&h=300&fit=crop&auto=format",
    rating: 4.7,
    time: "1 min",
  },
];

const CATEGORIES = ["Todos", "Salgados", "Lanches", "Doces", "Bebidas"];

// ---------------------- ESTADO DA APLICAÇÃO ----------------------
const state = {
  screen: "login",
  cart: [],            // [{...item, qty}]
  category: "Todos",
  orderCode: "",
  form: { name: "", payment: "pix" },
  loginData: { email: "", password: "" },
  loggedUser: "",
  generatedCode: "",
  digits: ["", "", "", "", "", ""],
  countdown: 60,
  canResend: false,
  timerHandle: null,
};

// ---------------------- HELPERS ----------------------
function formatMoney(value) {
  return "R$ " + value.toFixed(2).replace(".", ",");
}

function totalItems() {
  return state.cart.reduce((s, i) => s + i.qty, 0);
}

function totalPrice() {
  return state.cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function showScreen(name) {
  state.screen = name;
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  document.getElementById("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);

  if (name === "home") renderHome();
  if (name === "cart") renderCart();
  if (name === "checkout") renderCheckout();
  if (name === "success") renderSuccess();
}

// ---------------------- LOGIN ----------------------
const loginForm = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-password");
const loginErrorBox = document.getElementById("login-error");
const loginSubmitBtn = document.getElementById("login-submit");
const loginSubmitText = document.getElementById("login-submit-text");
const loginSpinner = document.getElementById("login-spinner");
const togglePassBtn = document.getElementById("toggle-pass");

togglePassBtn.addEventListener("click", () => {
  const isPassword = loginPasswordInput.type === "password";
  loginPasswordInput.type = isPassword ? "text" : "password";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginErrorBox.classList.add("hidden");

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  if (!email.endsWith("@escola.pr.gov.br")) {
    loginErrorBox.textContent = "Use seu e-mail @escola.pr.gov.br";
    loginErrorBox.classList.remove("hidden");
    return;
  }
  if (password.length < 4) {
    loginErrorBox.textContent = "Senha inválida.";
    loginErrorBox.classList.remove("hidden");
    return;
  }

  state.loginData = { email, password };

  loginSubmitBtn.disabled = true;
  loginSubmitText.classList.add("hidden");
  loginSpinner.classList.remove("hidden");

  setTimeout(() => {
    loginSubmitBtn.disabled = false;
    loginSubmitText.classList.remove("hidden");
    loginSpinner.classList.add("hidden");

    state.generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    state.digits = ["", "", "", "", "", ""];

    document.getElementById("verify-email").textContent = state.loginData.email;
    document.getElementById("generated-code").textContent = state.generatedCode;
    document.getElementById("verify-error").classList.add("hidden");
    resetDigitInputs();
    startCountdown();

    showScreen("verify");
  }, 1200);
});

// ---------------------- VERIFICAÇÃO (2 ETAPAS) ----------------------
const digitInputs = Array.from(document.querySelectorAll(".digit-input"));
const verifyForm = document.getElementById("verify-form");
const verifyErrorBox = document.getElementById("verify-error");
const verifySubmitBtn = document.getElementById("verify-submit");
const verifySubmitText = document.getElementById("verify-submit-text");
const verifySpinner = document.getElementById("verify-spinner");
const resendBtn = document.getElementById("resend-btn");
const countdownText = document.getElementById("countdown-text");
const countdownNum = document.getElementById("countdown-num");
const backToLoginBtn = document.getElementById("back-to-login");

function resetDigitInputs() {
  digitInputs.forEach((input) => {
    input.value = "";
    input.classList.remove("filled");
  });
  verifySubmitBtn.disabled = true;
  digitInputs[0].focus();
}

digitInputs.forEach((input, idx) => {
  input.addEventListener("input", (e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    e.target.value = val;
    state.digits[idx] = val;
    e.target.classList.toggle("filled", !!val);

    if (val && idx < digitInputs.length - 1) {
      digitInputs[idx + 1].focus();
    }

    verifySubmitBtn.disabled = state.digits.some((d) => d === "");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && idx > 0) {
      digitInputs[idx - 1].focus();
    }
  });
});

function startCountdown() {
  state.countdown = 60;
  state.canResend = false;
  resendBtn.classList.add("hidden");
  countdownText.classList.remove("hidden");
  countdownNum.textContent = state.countdown + "s";

  if (state.timerHandle) clearInterval(state.timerHandle);
  state.timerHandle = setInterval(() => {
    state.countdown -= 1;
    if (state.countdown <= 0) {
      clearInterval(state.timerHandle);
      state.canResend = true;
      resendBtn.classList.remove("hidden");
      countdownText.classList.add("hidden");
    } else {
      countdownNum.textContent = state.countdown + "s";
    }
  }, 1000);
}

verifyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const entered = state.digits.join("");
  if (entered.length < 6) {
    verifyErrorBox.textContent = "Digite o código completo de 6 dígitos.";
    verifyErrorBox.classList.remove("hidden");
    return;
  }

  verifySubmitBtn.disabled = true;
  verifySubmitText.classList.add("hidden");
  verifySpinner.classList.remove("hidden");

  setTimeout(() => {
    verifySubmitBtn.disabled = false;
    verifySubmitText.classList.remove("hidden");
    verifySpinner.classList.add("hidden");

    if (entered === state.generatedCode) {
      const namePart = state.loginData.email.split("@")[0];
      const niceName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      state.loggedUser = niceName;
      state.form.name = niceName;
      document.getElementById("greeting-name").textContent = state.loggedUser;
      showScreen("home");
    } else {
      verifyErrorBox.textContent = "Código incorreto. Tente novamente.";
      verifyErrorBox.classList.remove("hidden");
      state.digits = ["", "", "", "", "", ""];
      resetDigitInputs();
    }
  }, 900);
});

resendBtn.addEventListener("click", () => {
  state.generatedCode = String(Math.floor(100000 + Math.random() * 900000));
  document.getElementById("generated-code").textContent = state.generatedCode;
  state.digits = ["", "", "", "", "", ""];
  verifyErrorBox.classList.add("hidden");
  resetDigitInputs();
  startCountdown();
});

backToLoginBtn.addEventListener("click", () => {
  if (state.timerHandle) clearInterval(state.timerHandle);
  state.digits = ["", "", "", "", "", ""];
  verifyErrorBox.classList.add("hidden");
  showScreen("login");
});

// ---------------------- CARDÁPIO / HOME ----------------------
const categoriesEl = document.getElementById("categories");
const menuListEl = document.getElementById("menu-list");
const cartBtn = document.getElementById("cart-btn");
const cartBadge = document.getElementById("cart-badge");
const logoutBtn = document.getElementById("logout-btn");
const homeCta = document.getElementById("home-cta");
const homeCtaCount = document.getElementById("home-cta-count");
const homeCtaPrice = document.getElementById("home-cta-price");
const viewCartBtn = document.getElementById("view-cart-btn");

function renderCategories() {
  categoriesEl.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-btn" + (state.category === cat ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      state.category = cat;
      renderHome();
    });
    categoriesEl.appendChild(btn);
  });
}

function addToCart(item) {
  const existing = state.cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...item, qty: 1 });
  }
  renderHome();
}

function removeFromCart(id) {
  const existing = state.cart.find((c) => c.id === id);
  if (!existing) return;
  if (existing.qty === 1) {
    state.cart = state.cart.filter((c) => c.id !== id);
  } else {
    existing.qty -= 1;
  }
  renderHome();
}

function renderMenuList() {
  menuListEl.innerHTML = "";
  const filtered = state.category === "Todos" ? MENU : MENU.filter((m) => m.category === state.category);

  filtered.forEach((item) => {
    const inCart = state.cart.find((c) => c.id === item.id);

    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-card-image">
        <img src="${item.image}" alt="${item.name}" />
        ${item.badge ? `<div class="menu-card-badge">${item.badge}</div>` : ""}
      </div>
      <div class="menu-card-info">
        <div>
          <div class="menu-card-name">${item.name}</div>
          <div class="menu-card-desc">${item.description}</div>
          <div class="menu-card-meta">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#e0151f" stroke="#e0151f"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${item.rating}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${item.time}</span>
          </div>
        </div>
        <div class="menu-card-footer">
          <span class="menu-card-price">${formatMoney(item.price)}</span>
          <div class="qty-area"></div>
        </div>
      </div>
    `;

    const qtyArea = card.querySelector(".qty-area");
    if (inCart) {
      qtyArea.innerHTML = `
        <div class="qty-control">
          <button class="qty-btn minus"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
          <span class="qty-value">${inCart.qty}</span>
          <button class="qty-btn plus"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
      `;
      qtyArea.querySelector(".minus").addEventListener("click", () => removeFromCart(item.id));
      qtyArea.querySelector(".plus").addEventListener("click", () => addToCart(item));
    } else {
      qtyArea.innerHTML = `
        <button class="add-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Adicionar
        </button>
      `;
      qtyArea.querySelector(".add-btn").addEventListener("click", () => addToCart(item));
    }

    menuListEl.appendChild(card);
  });
}

function renderHome() {
  renderCategories();
  renderMenuList();

  const count = totalItems();
  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.classList.remove("hidden");
    homeCta.classList.remove("hidden");
    homeCtaCount.textContent = count;
    homeCtaPrice.textContent = formatMoney(totalPrice());
  } else {
    cartBadge.classList.add("hidden");
    homeCta.classList.add("hidden");
  }
}

cartBtn.addEventListener("click", () => showScreen("cart"));
viewCartBtn.addEventListener("click", () => showScreen("cart"));

logoutBtn.addEventListener("click", () => {
  state.cart = [];
  state.orderCode = "";
  state.loginData = { email: "", password: "" };
  state.loggedUser = "";
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
  loginErrorBox.classList.add("hidden");
  showScreen("login");
});

// ---------------------- CARRINHO ----------------------
const cartContentEl = document.getElementById("cart-content");
const cartCtaEl = document.getElementById("cart-cta");
const cartBackBtn = document.getElementById("cart-back");
const checkoutBtn = document.getElementById("checkout-btn");

function renderCart() {
  cartContentEl.innerHTML = "";

  if (state.cart.length === 0) {
    cartContentEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-emoji">🛒</div>
        <div class="cart-empty-text">Sua sacola está vazia.<br />Escolha algo gostoso!</div>
        <button class="cart-empty-btn" id="cart-empty-go">Ver cardápio</button>
      </div>
    `;
    document.getElementById("cart-empty-go").addEventListener("click", () => showScreen("home"));
    cartCtaEl.classList.add("hidden");
    return;
  }

  state.cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatMoney(item.price * item.qty)}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn minus"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn plus"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
      </div>
    `;
    row.querySelector(".minus").addEventListener("click", () => { removeFromCart(item.id); renderCart(); });
    row.querySelector(".plus").addEventListener("click", () => { addToCart(item); renderCart(); });
    cartContentEl.appendChild(row);
  });

  const summary = document.createElement("div");
  summary.className = "cart-summary";
  let summaryRows = "";
  state.cart.forEach((item) => {
    summaryRows += `
      <div class="cart-summary-row">
        <span class="muted">${item.qty}x ${item.name}</span>
        <span>${formatMoney(item.price * item.qty)}</span>
      </div>
    `;
  });
  summary.innerHTML = `
    <div class="cart-summary-title">RESUMO</div>
    ${summaryRows}
    <div class="cart-summary-total">
      <span>TOTAL</span>
      <span>${formatMoney(totalPrice())}</span>
    </div>
  `;
  cartContentEl.appendChild(summary);

  cartCtaEl.classList.remove("hidden");
}

cartBackBtn.addEventListener("click", () => showScreen("home"));
checkoutBtn.addEventListener("click", () => showScreen("checkout"));

// ---------------------- CHECKOUT ----------------------
const checkoutBackBtn = document.getElementById("checkout-back");
const customerNameInput = document.getElementById("customer-name");
const paymentOptionsEl = document.getElementById("payment-options");
const checkoutTotalEl = document.getElementById("checkout-total");
const checkoutSummaryEl = document.getElementById("checkout-summary");
const confirmPaymentBtn = document.getElementById("confirm-payment-btn");

function renderCheckout() {
  customerNameInput.value = state.form.name || "";
  updatePaymentSelection();

  checkoutTotalEl.textContent = formatMoney(totalPrice());
  const count = state.cart.length;
  checkoutSummaryEl.textContent = `${count} ${count === 1 ? "item" : "itens"} · Retirada na cantina com QR Code`;

  updateConfirmButtonState();
}

function updatePaymentSelection() {
  document.querySelectorAll(".payment-option").forEach((btn) => {
    const isActive = btn.dataset.method === state.form.payment;
    btn.classList.toggle("active", isActive);
    let check = btn.querySelector(".check-icon");
    if (isActive && !check) {
      check = document.createElement("span");
      check.className = "check-icon";
      check.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e0151f" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      btn.appendChild(check);
    } else if (!isActive && check) {
      check.remove();
    }
  });
}

function updateConfirmButtonState() {
  const hasName = customerNameInput.value.trim().length > 0;
  confirmPaymentBtn.disabled = !hasName;
}

customerNameInput.addEventListener("input", () => {
  state.form.name = customerNameInput.value;
  updateConfirmButtonState();
});

paymentOptionsEl.querySelectorAll(".payment-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.form.payment = btn.dataset.method;
    updatePaymentSelection();
  });
});

checkoutBackBtn.addEventListener("click", () => showScreen("cart"));

confirmPaymentBtn.addEventListener("click", () => {
  if (!customerNameInput.value.trim()) return;
  state.orderCode = "LRL-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  showScreen("success");
});

// ---------------------- SUCESSO / QR CODE ----------------------
const newOrderBtn = document.getElementById("new-order-btn");

function renderSuccess() {
  document.getElementById("order-code").textContent = state.orderCode;
  document.getElementById("detail-name").textContent = state.form.name;
  document.getElementById("detail-payment").textContent =
    state.form.payment.charAt(0).toUpperCase() + state.form.payment.slice(1);

  const itemsEl = document.getElementById("details-items");
  itemsEl.innerHTML = "";
  state.cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "details-item-row";
    row.innerHTML = `
      <span class="muted">${item.qty}x ${item.name}</span>
      <span>${formatMoney(item.price * item.qty)}</span>
    `;
    itemsEl.appendChild(row);
  });

  document.getElementById("detail-total").textContent = formatMoney(totalPrice());

  const maxTime = state.cart.length > 0
    ? Math.max(...state.cart.map((c) => parseInt(c.time)))
    : 10;
  document.getElementById("max-time").textContent = maxTime;

  const qrData = JSON.stringify({
    pedido: state.orderCode,
    aluno: state.form.name,
    total: totalPrice().toFixed(2),
    itens: state.cart.map((c) => c.name),
  });

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: qrData,
    width: 190,
    height: 190,
    colorDark: "#0a0a0a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

newOrderBtn.addEventListener("click", () => {
  state.cart = [];
  state.orderCode = "";
  showScreen("home");
});

// ---------------------- INICIALIZAÇÃO ----------------------
showScreen("login");
