const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".slider-dots");
let currentSlide = 0;
const slideInterval = 2000;
let intervalId;

function updateActiveDot(index) {
  const dots = dotsContainer.querySelectorAll("button");
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function showSlide(index) {
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });
  updateActiveDot(index);
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function createDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
      resetSlideInterval();
    });
    if (index === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });
}

function resetSlideInterval() {
  clearInterval(intervalId);
  intervalId = setInterval(nextSlide, slideInterval);
}

if (slides.length > 0) {
  createDots();
  intervalId = setInterval(nextSlide, slideInterval);
}

// Search functionality
const searchBar = document.querySelector(".search-bar");
const productCards = document.querySelectorAll(".product-card");
const categoryGroups = document.querySelectorAll(".category-group");
const miniProductCards = document.querySelectorAll(".mini-product-card");

function filterProducts() {
  const searchTerm = searchBar.value.toLowerCase().trim();

  let anyProductVisible = false;

  productCards.forEach((card) => {
    const productName = card.querySelector("h4").textContent.toLowerCase();
    const visible = productName.includes(searchTerm);
    card.style.display = visible ? "block" : "none";
    if (visible) anyProductVisible = true;
  });

  categoryGroups.forEach((group) => {
    const title = group.querySelector("h3").textContent.toLowerCase();
    const visibleProducts = group.querySelectorAll(
      ".product-card:not([style*='display: none'])",
    );
    const showGroup = title.includes(searchTerm) || visibleProducts.length > 0;
    group.style.display = showGroup ? "block" : "none";
  });

  miniProductCards.forEach((card) => {
    const productName = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = productName.includes(searchTerm) ? "block" : "none";
  });
}

if (searchBar) {
  searchBar.addEventListener("input", filterProducts);
}

const cart = [];
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotalElement = document.querySelector(".cart-total");
const checkoutButton = document.querySelector(".checkout-button");
const modalOverlay = document.getElementById("productModal");
const modalTitle = modalOverlay?.querySelector(".modal-title");
const modalPrice = modalOverlay?.querySelector(".modal-price");
const modalSpecs = modalOverlay?.querySelector(".modal-specs");
const modalImage = modalOverlay?.querySelector(".modal-image img");
const modalAddButton = modalOverlay?.querySelector(".modal-add-button");
const modalCloseButton = modalOverlay?.querySelector(".modal-close");

const productSpecs = {
  "4K Smart TV":
    "55-inch 4K HDR display with smart streaming apps and built-in speakers.",
  "OLED TV":
    "65-inch OLED display with ultra-thin design and advanced image processing.",
  "LED TV": "50-inch LED display with powerful sound and slim bezels.",
  "Double Door Fridge":
    "500L capacity, frost-free cooling and energy-efficient inverter technology.",
  "Mini Fridge": "Compact 120L fridge perfect for apartments and home offices.",
  "Smart Fridge":
    "Wi-Fi enabled fridge with intelligent cooling and freezer compartments.",
  "Front Load Washer":
    "8kg front-load washing machine with multiple wash programs.",
  "Top Load Washer":
    "10kg top-load washer with swift cleaning and easy controls.",
  "Washer Dryer": "Combo washer/dryer with quick-dry and eco-friendly cycles.",
  "Compact Dishwasher": "6-place setting dishwasher with energy-saving mode.",
  "Built-In Dishwasher":
    "Integrated dishwasher with silent operation and multiple wash cycles.",
  "Tabletop Dishwasher":
    "Portable dishwasher for small kitchens and easy installation.",
  Smartphone:
    "Latest smartphone with high-resolution camera and long battery life.",
  "Wireless Earbuds":
    "Noise-cancelling earbuds with up to 24 hours of battery life.",
  "Power Bank": "20,000mAh power bank with fast charging support.",
  "Gaming Laptop":
    "High-performance laptop with dedicated graphics for gaming.",
  Ultrabook: "Lightweight laptop with premium design and long battery runtime.",
  "Office Laptop": "Reliable laptop for productivity with fast SSD storage.",
  "Electric Kettle": "1.7L kettle with auto shutoff and rapid boil technology.",
  Toaster: "2-slice toaster with browning control and removable crumb tray.",
  Blender: "High-speed blender for smoothies, soups, and sauces.",
  "Steam Iron": "1700W steam iron with anti-drip and ceramic soleplate.",
  "Electric Chopper": "Compact electric chopper for fast food prep.",
  "Food Processor":
    "Multipurpose processor with chopping, slicing, and kneading functions.",
  "Xiaomi Redmi Note 14":
    "Latest Xiaomi smartphone with advanced camera, fast processor, and long-lasting battery.",
  "Ideal Granite Pot":
    "Durable granite cookware for even heat distribution and stylish kitchen use.",
  "Smart Steam Iron":
    "Advanced steam iron with smart technology for wrinkle-free clothes.",
  "Smart Electric Chopper":
    "Efficient electric chopper for quick and precise food preparation.",
};

function updateCart() {
  if (!cartItemsContainer || !cartTotalElement) return;
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      "<p class='empty-cart'>Your cart is empty.</p>";
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.specs}</p>
          <p class="price">${item.price.toFixed(2)} AED</p>
        </div>
        <div class="cart-item-actions">
          <button data-remove="${index}">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  }

  cartTotalElement.textContent = `Total: ${total.toFixed(2)} AED`;
}

function addProductToCart(name, price, image, specs) {
  cart.push({ name, price, image, specs });
  updateCart();
}

function formatPrice(priceText) {
  return parseFloat(priceText.replace(/[^0-9\.]/g, "")) || 0;
}

function openProductModal(card) {
  const name = card.querySelector("h4").textContent;
  const priceElement =
    card.querySelector(".price") || card.querySelector(".mini-price");
  const priceText = priceElement
    ? priceElement.textContent
    : "Price not available";
  const imageSrc = card.querySelector("img").src;
  const specs =
    productSpecs[name] ||
    "High-quality product with reliable performance and great value.";

  if (modalOverlay && modalTitle && modalPrice && modalSpecs && modalImage) {
    modalTitle.textContent = name;
    modalPrice.textContent = priceText;
    modalSpecs.textContent = specs;
    modalImage.src = imageSrc;
    modalImage.alt = name;
    modalOverlay.classList.add("active");

    modalAddButton.onclick = () => {
      addProductToCart(name, formatPrice(priceText), imageSrc, specs);
      modalOverlay.classList.remove("active");
    };
  }
}

function closeProductModal() {
  modalOverlay?.classList.remove("active");
}

if (modalCloseButton) {
  modalCloseButton.addEventListener("click", closeProductModal);
}

modalOverlay?.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeProductModal();
  }
});

productCards.forEach((card) => {
  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.textContent = "View Details";
  detailsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openProductModal(card);
  });
  card.querySelector(".product-info")?.appendChild(detailsBtn);
});

miniProductCards.forEach((card) => {
  const addBtn = document.createElement("button");
  addBtn.className = "add-to-cart";
  addBtn.textContent = "Add to Cart";
  addBtn.addEventListener("click", (event) => {
    const name = card.querySelector("h4").textContent;
    const priceText = card.querySelector(".mini-price").textContent;
    const imageSrc = card.querySelector("img").src;
    const specs =
      productSpecs[name] ||
      "High-quality product with reliable performance and great value.";
    addProductToCart(name, formatPrice(priceText), imageSrc, specs);
  });

  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.textContent = "View Details";
  detailsBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openProductModal(card);
  });

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "mini-buttons";
  buttonContainer.appendChild(addBtn);
  buttonContainer.appendChild(detailsBtn);
  card.appendChild(buttonContainer);
});

const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const name = card.querySelector("h4").textContent;
    const priceText = card.querySelector(".price").textContent;
    const imageSrc = card.querySelector("img").src;
    const specs =
      productSpecs[name] ||
      "High-quality product with reliable performance and great value.";
    addProductToCart(name, formatPrice(priceText), imageSrc, specs);
  });
});

const bannerButton = document.querySelector(".banner-button");
if (bannerButton) {
  bannerButton.addEventListener("click", () => {
    addProductToCart(
      "Clearance Bundle",
      499,
      "assets/clear.png",
      "Limited-time clearance bundle for top-selling electronics.",
    );
  });
}

if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("button[data-remove]");
    if (!removeButton) return;
    const index = Number(removeButton.dataset.remove);
    cart.splice(index, 1);
    updateCart();
  });
}

if (checkoutButton) {
  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Add a product first.");
      return;
    }
    alert(
      `Proceeding to checkout with ${cart.length} item(s). Total ${cartTotalElement.textContent.split(": ")[1]}`,
    );
  });
}

updateCart();

const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

function setActiveLink() {
  const navHeight = document.querySelector("nav").offsetHeight;
  const scrollPosition = window.pageYOffset + navHeight + 10;
  let current = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (scrollPosition >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
}

window.addEventListener("scroll", setActiveLink);
setActiveLink();
