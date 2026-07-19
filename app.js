/* ==========================================================================
   BEAST STORE — APPLICATION LOGIC
   Pure Vanilla JavaScript for State & UI Interaction
   ========================================================================== */

// 1. Product Database
const PRODUCTS = [
  {
    id: "prod-candle",
    category: "aromatics",
    name: "Beast Alpha Recover Candle",
    price: 3500,
    image: "images/candle.png",
    rating: 4.9,
    reviews: 48,
    description: "Premium recovery soy candle infused with red cedarwood and French lavender. Designed to create a calming, focused atmosphere post-training. Housed in a matte dark glass jar with a heavy brass lid.",
    specs: {
      "Material": "100% natural soy wax, cotton wick",
      "Dimensions": "3.5\" h x 3\" d (8 oz)",
      "Burn Time": "~50 hours",
      "Origin": "Forged in Letang, Nepal"
    }
  },
  {
    id: "prod-mug",
    category: "tableware",
    name: "Beast Iron Grip Mug",
    price: 4500,
    image: "images/mug.png",
    rating: 4.8,
    reviews: 32,
    description: "A heavy-duty hand-thrown ceramic mug coated in an industrial matte oatmeal glaze. Built with a thick ergonomic handle to fit comfortably in large hands, maintaining beverage temperature through intense sessions.",
    specs: {
      "Material": "Hand-thrown heavy stoneware clay",
      "Dimensions": "4\" h x 3.2\" d (12 oz)",
      "Care": "Dishwasher and microwave safe",
      "Origin": "Forged in Bhaktapur, Nepal"
    }
  },
  {
    id: "prod-journal",
    category: "stationery",
    name: "Beast Workout Training Journal",
    price: 3000,
    image: "images/journal.png",
    rating: 4.7,
    reviews: 19,
    description: "A lay-flat training log bound in heavy-duty natural linen cloth. Consists of 160 pages of thick grid paper, engineered for plotting goals, tracking lifts, and writing daily workout metrics.",
    specs: {
      "Material": "Reinforced linen cover, 120gsm recycled grid paper",
      "Dimensions": "5.8\" x 8.3\" (A5 size)",
      "Pages": "160 pages (dotted grid)",
      "Origin": "Forged in Letang, Nepal"
    }
  },
  {
    id: "prod-tray",
    category: "aromatics",
    name: "Beast Travertine Gear Valet",
    price: 5500,
    image: "images/tray.png",
    rating: 4.9,
    reviews: 26,
    description: "Carved from a solid slab of Italian travertine limestone, this heavy-duty tray serves as a visual staging area for keys, watches, candles, or everyday pocket gear. Features natural cavities and a heavy rustic feel.",
    specs: {
      "Material": "Travertine limestone slab",
      "Dimensions": "9\" l x 4.5\" w x 0.8\" h",
      "Finish": "Unsealed matte heavy finish",
      "Origin": "Forged in Lalitpur, Nepal"
    }
  },
  {
    id: "prod-hoodie",
    category: "streetwear",
    name: "Beast Heavyweight Gym Hoodie",
    price: 8500,
    image: "images/hoodie.png",
    rating: 4.9,
    reviews: 72,
    description: "Engineered from custom 450gsm organic cotton brushback fleece, this heavyweight streetwear hoodie is built for pre-workout warmth and post-training comfort. Features a double-lined hood and heavy steel aglets.",
    specs: {
      "Material": "100% Organic Cotton, 450gsm",
      "Fit": "Relaxed boxy silhouette",
      "Care": "Machine wash cold, air dry",
      "Origin": "Forged in Kathmandu, Nepal"
    }
  },
  {
    id: "prod-kettlebell",
    category: "gear",
    name: "Beast Hand-Forged Kettlebell",
    price: 12000,
    image: "images/kettlebell.png",
    rating: 5.0,
    reviews: 14,
    description: "Individually hand-cast from molten iron by traditional metal artisans. Finished with a heavy black powder coat for superior chalk retention and grip stability. Each weight is balanced and stamped with the Beast insignia.",
    specs: {
      "Material": "Solid sand-cast iron",
      "Weight": "16 kg (35 lbs)",
      "Finish": "Matte black powder coat",
      "Origin": "Forged in Lalitpur, Nepal"
    }
  },
  {
    id: "prod-gym-belt",
    category: "gear",
    name: "Beast Leather Lifting Belt",
    price: 9500,
    image: "images/gym_belt.png",
    rating: 4.8,
    reviews: 29,
    description: "A heavy-duty 4-inch powerlifting belt crafted from 10mm thick premium vegetable-tanned saddle leather. Features a heavy-duty stainless steel double-prong buckle and reinforced double stitching to support your heaviest lifts.",
    specs: {
      "Material": "Vegetable-tanned full-grain leather",
      "Thickness": "10 mm",
      "Width": "4 inches",
      "Origin": "Forged in Morang, Nepal"
    }
  },
  {
    id: "prod-titanium-flask",
    category: "tableware",
    name: "Beast Titanium Flask",
    price: 6800,
    image: "images/titanium_flask.png",
    rating: 4.9,
    reviews: 22,
    description: "Ultralight yet indestructible. Crafted from Grade 1 pure titanium with a double-wall vacuum structure to keep drinks piping hot or ice-cold for hours. Naturally biocompatible and corrosion-resistant.",
    specs: {
      "Material": "Grade 1 Titanium",
      "Capacity": "500 ml (18 oz)",
      "Weight": "150 grams",
      "Origin": "Forged in Solukhumbu, Nepal"
    }
  }
];

// 2. Global State
let state = {
  cart: [],
  currentUser: null,
  activeCategory: "all",
  currentModalProduct: null,
  modalQty: 1,
  activePaymentMethod: "card"
};

// 3. Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  initAppState();
  registerEventListeners();
  renderProducts();
  updateUI();
  initBackgroundCanvas();
  
  // Show home section by default
  navigateToSection("home");
  
  // Setup authorization forms based on session state (non-blocking)
  setupAuthForms();
});

// --- Currency and Price Formatting Helper ---
function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-NP')}`;
}

// --- Auth Error Message Helpers ---
function showAuthError(formId, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  let errDiv = form.querySelector(".auth-error-message");
  if (!errDiv) {
    errDiv = document.createElement("div");
    errDiv.className = "auth-error-message";
    errDiv.style.color = "#E63946";
    errDiv.style.fontSize = "0.85rem";
    errDiv.style.marginTop = "-5px";
    errDiv.style.marginBottom = "15px";
    errDiv.style.padding = "10px 15px";
    errDiv.style.backgroundColor = "rgba(230, 57, 70, 0.1)";
    errDiv.style.borderLeft = "3px solid #E63946";
    form.insertBefore(errDiv, form.firstChild);
  }
  errDiv.textContent = message;
  errDiv.style.display = "block";
}

function clearAuthError(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const errDiv = form.querySelector(".auth-error-message");
  if (errDiv) {
    errDiv.style.display = "none";
  }
}

// --- State Management Helpers ---
function initAppState() {
  // Load Cart
  const savedCart = localStorage.getItem("komorebi_cart");
  if (savedCart) {
    try {
      state.cart = JSON.parse(savedCart);
    } catch (e) {
      state.cart = [];
    }
  }

  // Load User Session
  const savedUser = localStorage.getItem("komorebi_user");
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
    } catch (e) {
      state.currentUser = null;
    }
  }
}

function saveCartToStorage() {
  localStorage.setItem("komorebi_cart", JSON.stringify(state.cart));
}

function saveUserToStorage(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem("komorebi_user", JSON.stringify(user));
    document.body.classList.remove("auth-locked");
    document.getElementById("auth-overlay").classList.remove("open");
  } else {
    localStorage.removeItem("komorebi_user");
    // Removed screen locking on sign out to maintain a proper shopping experience
  }
  updateUI();
}

// --- Render Products Catalog ---
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  const filtered = PRODUCTS.filter(p => 
    state.activeCategory === "all" || p.category === state.activeCategory
  );

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("data-id", product.id);

    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-quick-view" onclick="triggerQuickView('${product.id}')">Quick View</div>
      </div>
      <div class="product-info-wrap">
        <span class="product-cat">${product.category}</span>
        <h3 class="product-card-title">${product.name}</h3>
        <div class="product-card-meta">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          <span class="add-bag-link" onclick="quickAddCart('${product.id}')">Add to Bag</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- Dynamic Interactive Event Listeners ---
function registerEventListeners() {
  // 1. Navigation - section-based visibility toggle
  const navLinks = document.querySelectorAll("[data-section]");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-section");
      navigateToSection(target);
    });
  });

  // 2. Category filters
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      state.activeCategory = e.target.getAttribute("data-category");
      renderProducts();
    });
  });

  // 3. Cart Drawer Toggles
  const cartBtn = document.getElementById("cart-btn");
  const cartDrawer = document.getElementById("cart-drawer");
  const closeCartBtn = cartDrawer.querySelector(".drawer-close");
  const cartBackdrop = cartDrawer.querySelector(".drawer-backdrop");

  const toggleCart = (open) => {
    if (open) {
      cartDrawer.classList.add("open");
      renderCart();
    } else {
      cartDrawer.classList.remove("open");
      // Reset checkout view inside drawer when closed
      document.getElementById("checkout-view").classList.add("hidden");
      document.getElementById("checkout-success").classList.add("hidden");
      document.getElementById("cart-items-container").classList.remove("hidden");
      document.getElementById("drawer-footer-actions").classList.remove("hidden");
    }
  };

  cartBtn.addEventListener("click", () => toggleCart(true));
  closeCartBtn.addEventListener("click", () => toggleCart(false));
  cartBackdrop.addEventListener("click", () => toggleCart(false));

  // 4. Product Modal Toggles
  const productModal = document.getElementById("product-modal");
  const closeModalBtn = productModal.querySelector(".modal-close");
  const modalBackdrop = productModal.querySelector(".modal-backdrop");

  const toggleModal = (open) => {
    if (open) {
      productModal.classList.add("open");
    } else {
      productModal.classList.remove("open");
    }
  };

  closeModalBtn.addEventListener("click", () => toggleModal(false));
  modalBackdrop.addEventListener("click", () => toggleModal(false));

  // Modal Tab switching
  const tabBtns = productModal.querySelectorAll(".product-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      tabBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const tabId = e.target.getAttribute("data-tab");
      productModal.querySelectorAll(".product-tab-content").forEach(content => {
        content.classList.remove("active");
      });
      document.getElementById(`tab-${tabId}`).classList.add("active");
    });
  });

  // Modal Quantity adjustment
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");
  const qtyInput = document.getElementById("qty-input");

  qtyMinus.addEventListener("click", () => {
    if (state.modalQty > 1) {
      state.modalQty--;
      qtyInput.value = state.modalQty;
    }
  });

  qtyPlus.addEventListener("click", () => {
    if (state.modalQty < 10) {
      state.modalQty++;
      qtyInput.value = state.modalQty;
    }
  });

  // Modal Add to Cart Action
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  addToCartBtn.addEventListener("click", () => {
    if (state.currentModalProduct) {
      addToCart(state.currentModalProduct.id, state.modalQty);
      toggleModal(false);
      toggleCart(true); // Open cart to show item added
    }
  });

  // 5. Authentication Screen Toggles
  const authBtn = document.getElementById("auth-btn");
  const authOverlay = document.getElementById("auth-overlay");
  const closeAuthBtn = authOverlay.querySelector(".auth-close");
  const authBackdrop = authOverlay.querySelector(".auth-backdrop");

  const toggleAuth = (open) => {
    if (open) {
      authOverlay.classList.add("open");
      setupAuthForms();
    } else {
      authOverlay.classList.remove("open");
      clearAuthError("login-form");
      clearAuthError("register-form");
    }
  };

  authBtn.addEventListener("click", () => toggleAuth(true));
  closeAuthBtn.addEventListener("click", () => toggleAuth(false));
  authBackdrop.addEventListener("click", () => toggleAuth(false));

  // Auth Form switches
  const loginTab = document.getElementById("tab-login-btn");
  const registerTab = document.getElementById("tab-register-btn");

  const showAuthForm = (isLogin) => {
    if (isLogin) {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      document.getElementById("login-form-container").classList.remove("hidden");
      document.getElementById("register-form-container").classList.add("hidden");
    } else {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      document.getElementById("register-form-container").classList.remove("hidden");
      document.getElementById("login-form-container").classList.add("hidden");
    }
  };

  loginTab.addEventListener("click", () => showAuthForm(true));
  registerTab.addEventListener("click", () => showAuthForm(false));

  // Forms Submissions
  // A. Login Submission
  const loginForm = document.getElementById("login-form");

  // --- Restore remembered credentials on form load ---
  const remembered = JSON.parse(localStorage.getItem("komorebi_remember") || "null");
  if (remembered) {
    document.getElementById("login-email").value = remembered.email || "";
    document.getElementById("login-password").value = remembered.password || "";
    document.getElementById("login-remember").checked = true;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const rememberMe = document.getElementById("login-remember").checked;
    const subscribeMe = document.getElementById("login-sub-checkbox").checked;

    // Look up registered users
    let registeredUsers = JSON.parse(localStorage.getItem("komorebi_registered_users") || "[]");
    let user = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      showAuthError("login-form", "No account found with this email. Please register first.");
      return;
    }

    if (user.password !== password) {
      showAuthError("login-form", "Incorrect password. Please try again.");
      return;
    }

    clearAuthError("login-form");

    // Save or clear remembered credentials
    if (rememberMe) {
      localStorage.setItem("komorebi_remember", JSON.stringify({ email, password }));
    } else {
      localStorage.removeItem("komorebi_remember");
    }

    if (subscribeMe && !user.subscribed) {
      user.subscribed = true;
      saveSubscriber(email);
      // Update stored user
      localStorage.setItem("komorebi_registered_users", JSON.stringify(registeredUsers));
    }

    saveUserToStorage(user);
    setupAuthForms();
    console.log("Logged in user:", user);
  });

  // B. Register Submission
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const subscribeMe = document.getElementById("reg-sub-checkbox").checked;

    if (password.length < 8) {
      showAuthError("register-form", "Password must be at least 8 characters.");
      return;
    }

    let registeredUsers = JSON.parse(localStorage.getItem("komorebi_registered_users") || "[]");

    if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      showAuthError("register-form", "An account with this email already exists. Please sign in.");
      return;
    }

    clearAuthError("register-form");

    const newUser = { name, email, password, subscribed: subscribeMe };
    registeredUsers.push(newUser);
    localStorage.setItem("komorebi_registered_users", JSON.stringify(registeredUsers));

    if (subscribeMe) {
      saveSubscriber(email);
    }

    saveUserToStorage(newUser);
    setupAuthForms();
    console.log("Registered new user:", newUser);
  });

  // C. Logout Action
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn.addEventListener("click", () => {
    saveUserToStorage(null);
    localStorage.removeItem("komorebi_remember"); // Clear remembered credentials on explicit sign-out
    setupAuthForms();
    // Pre-clear the login fields so they don't show stale data
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("login-remember").checked = false;
    console.log("Logged out successfully");
  });

  // Password Show/Hide Toggles
  document.querySelectorAll(".pwd-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const eyeOpen = btn.querySelector(".eye-open");
      const eyeClosed = btn.querySelector(".eye-closed");

      if (input.type === "password") {
        input.type = "text";
        eyeOpen.classList.add("hidden");
        eyeClosed.classList.remove("hidden");
      } else {
        input.type = "password";
        eyeOpen.classList.remove("hidden");
        eyeClosed.classList.add("hidden");
      }
    });
  });

  // D. Subscription on Auth Split Card (Right Side)
  const authSubscribeForm = document.getElementById("auth-subscribe-form");
  authSubscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("auth-sub-email");
    const feedback = document.getElementById("auth-subscribe-feedback");
    
    if (saveSubscriber(emailInput.value)) {
      feedback.textContent = "Thank you! You are now subscribed.";
      feedback.className = "promo-feedback success";
      emailInput.value = "";
      setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "promo-feedback";
      }, 5000);

      // Auto update dashboard if logged in user subscribed
      if (state.currentUser && state.currentUser.email.toLowerCase() === emailInput.value.toLowerCase()) {
        state.currentUser.subscribed = true;
        saveUserToStorage(state.currentUser);
      }
    }
  });

  // E. Subscription on Footer Form
  const footerNewsletterForm = document.getElementById("footer-newsletter-form");
  footerNewsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = footerNewsletterForm.querySelector("input");
    const feedback = document.getElementById("footer-subscribe-message");

    if (saveSubscriber(input.value)) {
      feedback.textContent = "Subscribed successfully! Check your inbox for your 15% discount code.";
      feedback.className = "subscribe-feedback success";
      input.value = "";
      setTimeout(() => {
        feedback.textContent = "";
        feedback.className = "subscribe-feedback";
      }, 6000);
    }
  });

  // F. Contact Form Submission
  const contactForm = document.getElementById("contact-form");
  const contactSuccess = document.getElementById("contact-success");
  const closeSuccessBtn = contactSuccess.querySelector(".close-success-btn");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Gather details
    const formData = {
      name: document.getElementById("contact-name").value,
      email: document.getElementById("contact-email").value,
      subject: document.getElementById("contact-subject").value,
      message: document.getElementById("contact-message").value
    };

    console.log("Simulating Contact Message Submission:", formData);
    
    // Animate Success Panel
    contactSuccess.classList.add("active");
  });

  closeSuccessBtn.addEventListener("click", () => {
    contactSuccess.classList.remove("active");
    contactForm.reset();
  });

  // G. Checkout Flow inside Cart Drawer
  const goToCheckoutBtn = document.getElementById("go-to-checkout-btn");
  const backToCartBtn = document.getElementById("back-to-cart-btn");
  const checkoutView = document.getElementById("checkout-view");
  const checkoutSuccessView = document.getElementById("checkout-success");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const drawerFooter = document.getElementById("drawer-footer-actions");
  const checkoutForm = document.getElementById("checkout-form");
  const closeSuccessCheckoutBtn = document.getElementById("close-success-checkout-btn");

  goToCheckoutBtn.addEventListener("click", () => {
    if (state.cart.length === 0) return;
    
    // Intercept checkout if user is not authenticated
    if (!state.currentUser) {
      toggleCart(false);
      toggleAuth(true);
      showAuthForm(true);
      showAuthError("login-form", "Please sign in or register to complete your purchase.");
      return;
    }
    
    // Autofill email and name if logged in
    document.getElementById("chk-name").value = state.currentUser.name;
    document.getElementById("chk-email").value = state.currentUser.email;

    cartItemsContainer.classList.add("hidden");
    drawerFooter.classList.add("hidden");
    checkoutView.classList.remove("hidden");
  });

  backToCartBtn.addEventListener("click", () => {
    checkoutView.classList.add("hidden");
    cartItemsContainer.classList.remove("hidden");
    drawerFooter.classList.remove("hidden");
  });

  // Payment Method Tab Switches
  const payTabBtns = document.querySelectorAll(".pay-tab-btn");
  payTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      payTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const method = btn.getAttribute("data-method");
      state.activePaymentMethod = method;
      
      // Hide all fields
      document.querySelectorAll(".payment-fields").forEach(f => f.classList.add("hidden"));
      
      // Show active fields
      const activeFields = document.getElementById(`fields-${method}`);
      if (activeFields) {
        activeFields.classList.remove("hidden");
      }
      
      // Update required attributes
      const cardInputs = document.querySelectorAll("#fields-card input");
      const esewaInputs = document.querySelectorAll("#fields-esewa input");
      const khaltiInputs = document.querySelectorAll("#fields-khalti input");
      
      if (method === "card") {
        cardInputs.forEach(i => i.setAttribute("required", "required"));
        esewaInputs.forEach(i => i.removeAttribute("required"));
        khaltiInputs.forEach(i => i.removeAttribute("required"));
      } else if (method === "esewa") {
        cardInputs.forEach(i => i.removeAttribute("required"));
        esewaInputs.forEach(i => i.setAttribute("required", "required"));
        khaltiInputs.forEach(i => i.removeAttribute("required"));
      } else if (method === "khalti") {
        cardInputs.forEach(i => i.removeAttribute("required"));
        esewaInputs.forEach(i => i.removeAttribute("required"));
        khaltiInputs.forEach(i => i.setAttribute("required", "required"));
      }
    });
  });

  // Handle simulated checkout submission
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Calculate final totals for order details
    let subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 10000 ? 0 : 500;
    const total = subtotal + shipping;
    
    const customerInfo = {
      name: document.getElementById("chk-name").value,
      email: document.getElementById("chk-email").value,
      street: document.getElementById("chk-address").value,
      city: document.getElementById("chk-city").value,
      zip: document.getElementById("chk-zip").value
    };

    // Trigger loader state
    const loadingOverlay = document.getElementById("checkout-loading");
    const loadingStatus = document.getElementById("checkout-loading-status");
    
    checkoutView.classList.add("hidden");
    loadingOverlay.classList.remove("hidden");
    
    if (state.activePaymentMethod === "card") {
      loadingStatus.textContent = "Authorizing credit card...";
      setTimeout(() => {
        completeSimulatedPayment(customerInfo, subtotal, shipping, total, "Card Payment", "TXN-CARD-" + Math.floor(100000 + Math.random() * 900000));
      }, 1800);
    } else {
      const isEsewa = state.activePaymentMethod === "esewa";
      loadingStatus.textContent = `Connecting to ${isEsewa ? "eSewa Secure Gateway" : "Khalti Merchant API"}...`;
      
      setTimeout(() => {
        // Show OTP dialog
        loadingOverlay.classList.add("hidden");
        const otpOverlay = document.getElementById("checkout-otp-verification");
        const logoContainer = document.getElementById("otp-brand-logo-container");
        
        // Render logo label
        if (isEsewa) {
          logoContainer.innerHTML = `<span style="color:#60bb46; font-weight:bold; font-size:1.4rem;">eSewa</span>`;
        } else {
          logoContainer.innerHTML = `<span style="color:#5c2d91; font-weight:bold; font-size:1.4rem;">Khalti</span>`;
        }
        
        otpOverlay.classList.remove("hidden");
        document.getElementById("chk-otp").value = "";
        document.getElementById("chk-otp").focus();
        document.getElementById("otp-error-message").classList.add("hidden");
      }, 1500);
    }
  });

  // Verify OTP handler
  const confirmOtpBtn = document.getElementById("confirm-otp-btn");
  const cancelOtpBtn = document.getElementById("cancel-otp-btn");
  const otpOverlay = document.getElementById("checkout-otp-verification");

  confirmOtpBtn.addEventListener("click", () => {
    const otpVal = document.getElementById("chk-otp").value;
    const otpError = document.getElementById("otp-error-message");
    
    if (!/^\d{6}$/.test(otpVal)) {
      otpError.textContent = "Please enter a valid 6-digit OTP code.";
      otpError.classList.remove("hidden");
      return;
    }
    
    otpOverlay.classList.add("hidden");
    const loadingOverlay = document.getElementById("checkout-loading");
    const loadingStatus = document.getElementById("checkout-loading-status");
    
    loadingOverlay.classList.remove("hidden");
    loadingStatus.textContent = "Verifying transaction OTP...";
    
    // Calculate final totals for order details
    let subtotal = state.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = subtotal >= 10000 ? 0 : 500;
    const total = subtotal + shipping;
    
    const customerInfo = {
      name: document.getElementById("chk-name").value,
      email: document.getElementById("chk-email").value,
      street: document.getElementById("chk-address").value,
      city: document.getElementById("chk-city").value,
      zip: document.getElementById("chk-zip").value
    };

    setTimeout(() => {
      const isEsewa = state.activePaymentMethod === "esewa";
      const gateway = isEsewa ? "eSewa Wallet" : "Khalti Wallet";
      const prefix = isEsewa ? "TXN-ESEWA-" : "TXN-KHALTI-";
      const txId = prefix + Math.floor(100000 + Math.random() * 900000);
      completeSimulatedPayment(customerInfo, subtotal, shipping, total, gateway, txId);
    }, 1200);
  });

  cancelOtpBtn.addEventListener("click", () => {
    otpOverlay.classList.add("hidden");
    checkoutView.classList.remove("hidden");
  });

  closeSuccessCheckoutBtn.addEventListener("click", () => {
    checkoutSuccessView.classList.add("hidden");
    cartItemsContainer.classList.remove("hidden");
    drawerFooter.classList.remove("hidden");
    checkoutForm.reset();
    toggleCart(false); // Close drawer
  });

  // Utility format credit card input (4111 2222 3333 4444)
  const ccInput = document.getElementById("chk-card");
  ccInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      e.target.value = parts.join(' ');
    } else {
      e.target.value = value;
    }
  });

  // Format Expiry (MM/YY)
  const expInput = document.getElementById("chk-expiry");
  expInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      e.target.value = value;
    }
  });
}

// --- Complete Simulated Payment & Generate Receipt ---
function completeSimulatedPayment(customerInfo, subtotal, shipping, total, gateway, txId) {
  // Clear cart state
  const orderItems = [...state.cart];
  state.cart = [];
  saveCartToStorage();
  updateUI();
  
  // Hide loading
  document.getElementById("checkout-loading").classList.add("hidden");
  
  // Render digital receipt
  const receiptContainer = document.getElementById("digital-receipt");
  if (receiptContainer) {
    let itemsHtml = orderItems.map(item => `
      <div class="receipt-item" style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem; border-bottom:1px dashed var(--border-color); padding-bottom:4px;">
        <span class="name" style="color:var(--color-text-muted);">${item.product.name} (x${item.quantity})</span>
        <span class="price" style="font-weight:500;">${formatPrice(item.product.price * item.quantity)}</span>
      </div>
    `).join('');

    receiptContainer.innerHTML = `
      <div class="receipt-card" style="background-color:var(--bg-secondary); border:1px solid var(--border-color); padding:20px; margin:20px 0; text-align:left; border-radius:4px;">
        <div class="receipt-header" style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:8px; font-size:0.8rem; font-family:var(--font-sans); color:var(--color-text-muted);">
          <span class="ref-num">REF: BST-${Math.floor(100000 + Math.random() * 900000)}</span>
          <span class="date">${new Date().toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        <div class="receipt-items-list" style="margin-bottom:15px;">
          ${itemsHtml}
        </div>
        <div class="receipt-totals" style="border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:15px;">
          <div class="receipt-line" style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
            <span>Subtotal</span>
            <span>${formatPrice(subtotal)}</span>
          </div>
          <div class="receipt-line" style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:0.85rem;">
            <span>Shipping</span>
            <span>${shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div class="receipt-line total" style="display:flex; justify-content:space-between; margin-top:8px; font-weight:600; font-size:1.05rem; color:var(--color-accent);">
            <span>Total Paid</span>
            <span>${formatPrice(total)}</span>
          </div>
        </div>
        <div class="receipt-payment-details" style="background-color:rgba(255,255,255,0.02); padding:10px 15px; margin-bottom:15px; border-radius:4px; font-size:0.85rem; border:1px dashed var(--border-color);">
          <div class="receipt-line" style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Gateway</span>
            <strong style="color:var(--color-dark);">${gateway}</strong>
          </div>
          <div class="receipt-line" style="display:flex; justify-content:space-between;">
            <span>Transaction ID</span>
            <code class="tx-id" style="color:var(--color-gold); font-size:0.8rem; letter-spacing:0.05em;">${txId}</code>
          </div>
        </div>
        <div class="receipt-shipping-details" style="font-size:0.8rem; color:var(--color-text-muted); line-height:1.5;">
          <h5 style="color:var(--color-dark); margin-bottom:4px; font-size:0.85rem; font-family:var(--font-sans); text-transform:uppercase; letter-spacing:0.05em;">Delivery Address</h5>
          <p>${customerInfo.name}<br>${customerInfo.street}, ${customerInfo.city} - ${customerInfo.zip}</p>
        </div>
      </div>
    `;
  }
  
  // Show success view
  document.getElementById("checkout-success").classList.remove("hidden");
}

// --- Setup Auth Overlay Forms ---
function setupAuthForms() {
  const loginFormContainer = document.getElementById("login-form-container");
  const registerFormContainer = document.getElementById("register-form-container");
  const dashboardContainer = document.getElementById("user-dashboard-container");
  const tabsNav = document.querySelector(".auth-nav-tabs");

  if (state.currentUser) {
    // Show Dashboard
    loginFormContainer.classList.add("hidden");
    registerFormContainer.classList.add("hidden");
    tabsNav.classList.add("hidden");
    dashboardContainer.classList.remove("hidden");

    // Populate info
    document.getElementById("user-display-name").textContent = state.currentUser.name;
    document.getElementById("user-display-email").textContent = state.currentUser.email;
    
    // Check if email is in newsletter subscriber list
    const subscribers = JSON.parse(localStorage.getItem("komorebi_subscribers") || "[]");
    const isSubscribed = state.currentUser.subscribed || subscribers.includes(state.currentUser.email.toLowerCase());
    document.getElementById("user-display-sub").textContent = isSubscribed ? "Active Member (15% Off Eligible)" : "Not Subscribed";
    
    if (isSubscribed && !state.currentUser.subscribed) {
      state.currentUser.subscribed = true;
      localStorage.setItem("komorebi_user", JSON.stringify(state.currentUser));
    }
  } else {
    // Reset back to tabs and login
    tabsNav.classList.remove("hidden");
    dashboardContainer.classList.add("hidden");
    showAuthForm(true); // Default to login tab
  }

  function showAuthForm(isLogin) {
    const loginTab = document.getElementById("tab-login-btn");
    const registerTab = document.getElementById("tab-register-btn");
    if (isLogin) {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginFormContainer.classList.remove("hidden");
      registerFormContainer.classList.add("hidden");
    } else {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      registerFormContainer.classList.remove("hidden");
      loginFormContainer.classList.add("hidden");
    }
  }
}

// --- Save Subscriber utility ---
function saveSubscriber(email) {
  if (!email || !email.includes("@")) return false;
  
  let subscribers = JSON.parse(localStorage.getItem("komorebi_subscribers") || "[]");
  email = email.trim().toLowerCase();

  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem("komorebi_subscribers", JSON.stringify(subscribers));
    console.log("New subscriber saved:", email);
  } else {
    console.log("Subscriber already registered:", email);
  }
  return true;
}

// --- Global UI Updates ---
function updateUI() {
  // Update Header User Profile state
  const indicator = document.getElementById("user-status-indicator");
  if (state.currentUser) {
    indicator.classList.add("online");
  } else {
    indicator.classList.remove("online");
  }

  // Update Cart badge item count
  const badge = document.getElementById("cart-badge");
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
  document.getElementById("cart-count").textContent = count;
}

// --- Trigger Quick View Modal ---
window.triggerQuickView = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.currentModalProduct = product;
  state.modalQty = 1;
  document.getElementById("qty-input").value = 1;

  // Populate Modal content
  document.getElementById("modal-product-img").src = product.image;
  document.getElementById("modal-product-img").alt = product.name;
  document.getElementById("modal-product-category").textContent = product.category;
  document.getElementById("modal-product-title").textContent = product.name;
  document.getElementById("modal-product-price").textContent = formatPrice(product.price);
  document.getElementById("modal-product-desc").textContent = product.description;
  document.getElementById("modal-product-rating-text").textContent = `${product.rating} (${product.reviews} reviews)`;

  // Specifications
  const specsList = document.getElementById("modal-product-specs");
  specsList.innerHTML = "";
  for (const [key, val] of Object.entries(product.specs)) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${key}:</strong> ${val}`;
    specsList.appendChild(li);
  }

  // Set default active tab to Description
  const tabs = document.querySelectorAll(".product-tab-btn");
  tabs.forEach(t => t.classList.remove("active"));
  tabs[0].classList.add("active");
  document.querySelectorAll(".product-tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById("tab-description").classList.add("active");

  // Open Modal
  document.getElementById("product-modal").classList.add("open");
};

// --- Quick Add Shortcut ---
window.quickAddCart = function(productId) {
  addToCart(productId, 1);
  // Open cart drawer for feedback
  document.getElementById("cart-drawer").classList.add("open");
  renderCart();
};

// --- Add to Cart State ---
function addToCart(productId, qty) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = state.cart.findIndex(item => item.product.id === productId);
  if (existingIndex > -1) {
    state.cart[existingIndex].quantity += qty;
    if (state.cart[existingIndex].quantity > 10) {
      state.cart[existingIndex].quantity = 10; // Cap at 10 items
    }
  } else {
    state.cart.push({ product, quantity: qty });
  }

  saveCartToStorage();
  updateUI();
}

// --- Render Cart Drawer List ---
function renderCart() {
  const itemsContainer = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("go-to-checkout-btn");

  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `<p class="empty-cart-msg">Your shopping bag is empty.</p>`;
    subtotalEl.textContent = formatPrice(0);
    shippingEl.textContent = "—";
    totalEl.textContent = formatPrice(0);
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.pointerEvents = "none";
    return;
  }

  checkoutBtn.style.opacity = "1";
  checkoutBtn.style.pointerEvents = "auto";

  let subtotal = 0;

  state.cart.forEach(item => {
    const itemSubtotal = item.product.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.product.image}" alt="${item.product.name}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.product.name}</h4>
        <span class="cart-item-price">${formatPrice(item.product.price)}</span>
        
        <div class="cart-item-actions">
          <div class="quantity-selector">
            <button class="qty-btn" onclick="adjustCartQty('${item.product.id}', -1)" aria-label="Decrease quantity">−</button>
            <input type="number" id="qty-input" value="${item.quantity}" readonly>
            <button class="qty-btn" onclick="adjustCartQty('${item.product.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-item-remove" onclick="removeCartItem('${item.product.id}')">Remove</span>
        </div>
      </div>
    `;
    itemsContainer.appendChild(row);
  });

  // Calculate Shipping & Total
  // Free shipping over Rs. 10,000, otherwise Rs. 500 flat rate
  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shipping;

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  totalEl.textContent = formatPrice(total);
}

// --- Cart Adjustments Called in Drawer ---
window.adjustCartQty = function(productId, delta) {
  const index = state.cart.findIndex(item => item.product.id === productId);
  if (index === -1) return;

  state.cart[index].quantity += delta;
  
  if (state.cart[index].quantity < 1) {
    state.cart.splice(index, 1);
  } else if (state.cart[index].quantity > 10) {
    state.cart[index].quantity = 10;
  }

  saveCartToStorage();
  updateUI();
  renderCart();
};

window.removeCartItem = function(productId) {
  state.cart = state.cart.filter(item => item.product.id !== productId);
  saveCartToStorage();
  updateUI();
  renderCart();
};

// ==========================================================================
//  SECTION NAVIGATION CONTROLLER
// ==========================================================================
const SECTION_IDS = ["home", "shop", "about", "contact"];

function navigateToSection(targetId) {
  if (!SECTION_IDS.includes(targetId)) return;

  // Hide all sections
  SECTION_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("section-active");
    }
  });

  // Show target section
  const target = document.getElementById(targetId);
  if (target) {
    target.classList.add("section-active");
    // Scroll target itself to top (in case it was scrolled)
    target.scrollTop = 0;
  }

  // Update active nav link indicators
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-section") === targetId) {
      link.classList.add("active");
    }
  });

  // Store current section in state
  state.activeSection = targetId;
}

// ==========================================================================
//  ANIMATED BACKGROUND CANVAS — Particle Grid
// ==========================================================================
function initBackgroundCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W, H, particles, animFrame;

  // Color palette: deep reds, golds, dark grays
  const COLORS = [
    "rgba(230, 57, 70, 0.35)",   // beast red
    "rgba(212, 175, 55, 0.25)",  // metallic gold
    "rgba(58, 134, 200, 0.2)",   // blue accent
    "rgba(255, 255, 255, 0.08)", // subtle white
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.7 + 0.3,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        alphaSpeed: Math.random() * 0.004 + 0.001
      });
    }
  }

  function connectParticles() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(230, 57, 70, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Deep dark gradient background
    const grad = ctx.createRadialGradient(W * 0.3, H * 0.3, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    grad.addColorStop(0, "#111111");
    grad.addColorStop(0.4, "#0C0C0C");
    grad.addColorStop(1, "#080808");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle red glow vignette top-left
    const glow1 = ctx.createRadialGradient(0, 0, 0, W * 0.2, H * 0.2, W * 0.55);
    glow1.addColorStop(0, "rgba(230, 57, 70, 0.07)");
    glow1.addColorStop(1, "transparent");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    // Gold glow bottom-right
    const glow2 = ctx.createRadialGradient(W, H, 0, W * 0.8, H * 0.8, W * 0.5);
    glow2.addColorStop(0, "rgba(212, 175, 55, 0.06)");
    glow2.addColorStop(1, "transparent");
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // Update & draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Pulse alpha
      p.alpha += p.alphaDir * p.alphaSpeed;
      if (p.alpha > 1) { p.alpha = 1; p.alphaDir = -1; }
      if (p.alpha < 0.1) { p.alpha = 0.1; p.alphaDir = 1; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, p.alpha + ")");
      ctx.fill();
    });

    connectParticles();
    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });

  resize();
  createParticles();
  draw();
}
