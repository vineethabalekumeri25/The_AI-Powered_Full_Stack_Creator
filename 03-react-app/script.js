// Product Data
const products = [
  {
    id: 1,
    name: "Velvet Matte Lipstick",
    brand: "Luxe Cosmetics",
    category: "lipstick",
    price: 28,
    rating: 4.8,
    reviews: 342,
    image: "/luxury-lipstick-velvet-matte.jpg",
  },
  {
    id: 2,
    name: "Flawless Foundation",
    brand: "Glow Studio",
    category: "foundation",
    price: 42,
    rating: 4.7,
    reviews: 521,
    image: "/foundation-makeup-product.jpg",
  },
  {
    id: 3,
    name: "Shimmer Eyeshadow Palette",
    brand: "Beauty Essentials",
    category: "eyeshadow",
    price: 35,
    rating: 4.9,
    reviews: 418,
    image: "/eyeshadow-palette-shimmer.jpg",
  },
  {
    id: 4,
    name: "Volumizing Mascara",
    brand: "Luxe Cosmetics",
    category: "mascara",
    price: 24,
    rating: 4.6,
    reviews: 289,
    image: "/mascara-volumizing-black.jpg",
  },
  {
    id: 5,
    name: "Rosy Blush",
    brand: "Glow Studio",
    category: "blush",
    price: 26,
    rating: 4.8,
    reviews: 356,
    image: "/blush-rosy-pink-makeup.jpg",
  },
  {
    id: 6,
    name: "Berry Lip Tint",
    brand: "Beauty Essentials",
    category: "lipstick",
    price: 22,
    rating: 4.7,
    reviews: 267,
    image: "/lip-tint-berry-color.jpg",
  },
  {
    id: 7,
    name: "Luminous Highlighter",
    brand: "Luxe Cosmetics",
    category: "blush",
    price: 32,
    rating: 4.9,
    reviews: 445,
    image: "/highlighter-luminous-glow.jpg",
  },
  {
    id: 8,
    name: "Matte Foundation Stick",
    brand: "Glow Studio",
    category: "foundation",
    price: 38,
    rating: 4.6,
    reviews: 312,
    image: "/foundation-stick-matte.jpg",
  },
  {
    id: 9,
    name: "Nude Eyeshadow",
    brand: "Beauty Essentials",
    category: "eyeshadow",
    price: 28,
    rating: 4.7,
    reviews: 198,
    image: "/eyeshadow-nude-natural.jpg",
  },
  {
    id: 10,
    name: "Waterproof Mascara",
    brand: "Luxe Cosmetics",
    category: "mascara",
    price: 26,
    rating: 4.8,
    reviews: 401,
    image: "/mascara-waterproof.jpg",
  },
  {
    id: 11,
    name: "Coral Blush",
    brand: "Glow Studio",
    category: "blush",
    price: 25,
    rating: 4.6,
    reviews: 234,
    image: "/blush-coral-peach.jpg",
  },
  {
    id: 12,
    name: "Red Velvet Lipstick",
    brand: "Beauty Essentials",
    category: "lipstick",
    price: 30,
    rating: 4.9,
    reviews: 523,
    image: "/lipstick-red-velvet.jpg",
  },
  {
    id: 13,
    name: "Dewy Foundation",
    brand: "Luxe Cosmetics",
    category: "foundation",
    price: 45,
    rating: 4.8,
    reviews: 467,
    image: "/foundation-dewy-glow.jpg",
  },
  {
    id: 14,
    name: "Smokey Eyeshadow Set",
    brand: "Glow Studio",
    category: "eyeshadow",
    price: 40,
    rating: 4.7,
    reviews: 389,
    image: "/eyeshadow-smokey-dark.jpg",
  },
  {
    id: 15,
    name: "Curling Mascara",
    brand: "Beauty Essentials",
    category: "mascara",
    price: 23,
    rating: 4.5,
    reviews: 276,
    image: "/mascara-curling-lash.jpg",
  },
  {
    id: 16,
    name: "Peach Blush",
    brand: "Luxe Cosmetics",
    category: "blush",
    price: 27,
    rating: 4.7,
    reviews: 312,
    image: "blush-coral-peach.jpg",
  },
  {
    id: 17,
    name: "Plum Lipstick",
    brand: "Glow Studio",
    category: "lipstick",
    price: 29,
    rating: 4.6,
    reviews: 298,
    image: "/luxury-lipstick-product.jpg",
  },
  {
    id: 18,
    name: "Porcelain Foundation",
    brand: "Beauty Essentials",
    category: "foundation",
    price: 40,
    rating: 4.8,
    reviews: 445,
    image: "/foundation-beauty-porcelain.jpg",
  },
  {
    id: 19,
    name: "Gold Eyeshadow",
    brand: "Luxe Cosmetics",
    category: "eyeshadow",
    price: 32,
    rating: 4.9,
    reviews: 356,
    image: "/eyeshadow-palette-luxury.jpg",
  },
  {
    id: 20,
    name: "Lengthening Mascara",
    brand: "Glow Studio",
    category: "mascara",
    price: 25,
    rating: 4.7,
    reviews: 334,
    image: "/mascara-beauty-product.jpg",
  },
]

let wishlist = []
let selectedCategories = ["all"]
let maxPrice = 100
const cartItems = {}

// Initialize carousel auto-scroll functionality
let carouselAutoScrollInterval
const CAROUSEL_SCROLL_INTERVAL = 5000 // 5 seconds

// This function sets up all the carousel functionality
// --- START: NEW INFINITE LOOP CAROUSEL CODE ---

function setupHeaderCarousel() {
    const container = document.getElementById("carouselContainer");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!container || !prevBtn || !nextBtn) {
        console.error("Carousel elements not found! Make sure your HTML has ids: carouselContainer, prevBtn, nextBtn");
        return;
    }

    // 1. DUPLICATE CONTENT FOR A SEAMLESS LOOP
    // This creates an "infinite" track for the carousel to scroll on.
    const originalItems = Array.from(container.children);
    originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        container.appendChild(clone);
    });

    let animationFrameId;
    const scrollSpeed = 1; // Adjust this value for faster or slower scrolling

    // 2. THE SMOOTH ANIMATION LOOP
    const scrollStep = () => {
        // Always scroll to the right
        container.scrollLeft += scrollSpeed;

        // 3. THE "SILENT JUMP" FOR INFINITE EFFECT
        // Calculate the width of the original, non-duplicated content
        const originalContentWidth = container.scrollWidth / 2;
        // If we have scrolled past the original content...
        if (container.scrollLeft >= originalContentWidth) {
            // ...instantly jump back to the beginning without animation.
            // Because the duplicated content is identical, this is invisible to the user.
            container.scrollLeft = 0;
        }

        // Continue the animation on the next browser frame
        animationFrameId = requestAnimationFrame(scrollStep);
    };

    const startAutoScroll = () => {
        // Clear any existing animation before starting
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(scrollStep);
    };

    // --- EVENT LISTENERS ---

    // Manual button clicks will temporarily stop the animation,
    // scroll one item, and then restart the animation.
    nextBtn.addEventListener("click", () => {
        cancelAnimationFrame(animationFrameId);
        const itemWidth = container.querySelector('.carousel-item')?.offsetWidth || 0;
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
        // Restart the continuous scroll after the smooth scroll animation finishes
        setTimeout(startAutoScroll, 500); 
    });

    prevBtn.addEventListener("click", () => {
        cancelAnimationFrame(animationFrameId);
        const itemWidth = container.querySelector('.carousel-item')?.offsetWidth || 0;
        
        // Handle scrolling left from the beginning to maintain the loop
        if (container.scrollLeft < itemWidth) {
             const originalContentWidth = container.scrollWidth / 2;
             // Jump to the end of the original content to scroll back from
             container.scrollTo({ left: originalContentWidth, behavior: 'auto' });
        }
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        setTimeout(startAutoScroll, 500); // Restart
    });

    // Pause animation on hover
    container.addEventListener('mouseenter', () => cancelAnimationFrame(animationFrameId));
    // Resume animation when mouse leaves
    container.addEventListener('mouseleave', startAutoScroll);

    // Start the animation for the first time
    startAutoScroll();
}

// --- END: FINAL INFINITE CONTINUOUS SCROLL CODE ---

// Scroll carousel by index
function scrollCarousel(direction) {
  const container = document.getElementById("carouselContainer")
  if (!container) {
    return
  }

  const prevBtn = document.querySelector(".carousel-nav-prev")
  const nextBtn = document.querySelector(".carousel-nav-next")

  if (!prevBtn || !nextBtn) {
    return
  }

  if (direction === -1 && prevBtn.disabled) {
    return
  }
  if (direction === 1 && nextBtn.disabled) {
    return
  }

  const scrollAmount = (container.clientWidth / 2) * direction

  container.scrollBy({
    left: scrollAmount,
    behavior: "smooth",
  })

  setTimeout(updateCarouselButtonStates, 600)

  // Reset auto-scroll timer
  clearInterval(carouselAutoScrollInterval)
  initCarouselAutoScroll()
}

// Update carousel button states based on scroll position
function updateCarouselButtonStates() {
  const container = document.getElementById("carouselContainer")
  const prevBtn = document.querySelector(".carousel-nav-prev")
  const nextBtn = document.querySelector(".carousel-nav-next")

  if (!container || !prevBtn || !nextBtn) return

  // Check if at the beginning (scrollLeft is 0 or very close to 0)
  const isAtStart = container.scrollLeft < 10

  // Check if at the end (scrollLeft + clientWidth >= scrollWidth)
  const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10

  // Disable/enable prev button
  if (isAtStart) {
    prevBtn.disabled = true
    prevBtn.style.opacity = "0.5"
    prevBtn.style.cursor = "not-allowed"
  } else {
    prevBtn.disabled = false
    prevBtn.style.opacity = "1"
    prevBtn.style.cursor = "pointer"
  }

  // Disable/enable next button
  if (isAtEnd) {
    nextBtn.disabled = true
    nextBtn.style.opacity = "0.5"
    nextBtn.style.cursor = "not-allowed"
  } else {
    nextBtn.disabled = false
    nextBtn.style.opacity = "1"
    nextBtn.style.cursor = "pointer"
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupEventListeners();
  loadWishlist();
  setupHeaderCarousel();
});

// Setup Event Listeners
function setupEventListeners() {
  // Category filters
  document.querySelectorAll(".filter-item").forEach((item) => {
    item.addEventListener("click", handleCategoryFilter)
  })

  const priceSlider = document.getElementById("priceSlider")
  priceSlider.addEventListener("input", (e) => {
    maxPrice = e.target.value
    document.getElementById("priceValue").textContent = maxPrice
    // Update the slider background gradient to show blue fill
    const percentage = (maxPrice / 100) * 100
    priceSlider.style.setProperty("--value", percentage + "%")
    renderProducts()
  })

  // Initialize slider fill on load
  const initialPercentage = (maxPrice / 100) * 100
  priceSlider.style.setProperty("--value", initialPercentage + "%")
}

// Setup Event Listeners
function setupEventListeners() {
  // Category filters
  document.querySelectorAll(".filter-item").forEach((item) => {
    item.addEventListener("click", handleCategoryFilter);
  });

  const priceSlider = document.getElementById("priceSlider");
  priceSlider.addEventListener("input", (e) => {
    maxPrice = e.target.value;
    document.getElementById("priceValue").textContent = maxPrice;
    const percentage = (maxPrice / 100) * 100;
    priceSlider.style.setProperty("--value", percentage + "%");
    renderProducts();
  });

  // Initialize slider fill on load
  const initialPercentage = (maxPrice / 100) * 100;
  priceSlider.style.setProperty("--value", initialPercentage + "%");

  // --- ADD THIS PART ---
  // Event listeners for the carousel navigation buttons
  const prevBtn = document.querySelector(".carousel-nav-prev");
  const nextBtn = document.querySelector(".carousel-nav-next");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => scrollCarousel(-1)); // Scroll backward
    nextBtn.addEventListener("click", () => scrollCarousel(1));   // Scroll forward
  }
  // --- END OF ADDED PART ---
}

// Handle Category Filter
function handleCategoryFilter(e) {
  const clickedItem = e.target
  const category = clickedItem.dataset.category
  const allItem = document.querySelector('.filter-item[data-category="all"]')
  const otherItems = document.querySelectorAll('.filter-item:not([data-category="all"])')

  if (category === "all") {
    otherItems.forEach((item) => item.classList.remove("active"))
    allItem.classList.add("active")
    selectedCategories = ["all"]
  } else {
    allItem.classList.remove("active")
    clickedItem.classList.toggle("active")
    selectedCategories = Array.from(otherItems)
      .filter((item) => item.classList.contains("active"))
      .map((item) => item.dataset.category)

    // If no categories selected, default to all
    if (selectedCategories.length === 0) {
      allItem.classList.add("active")
      selectedCategories = ["all"]
    }
  }

  renderProducts()
}

// Filter Products
function getFilteredProducts() {
  return products.filter((product) => {
    const categoryMatch = selectedCategories.includes("all") || selectedCategories.includes(product.category)
    const priceMatch = product.price <= maxPrice
    return categoryMatch && priceMatch
  })
}

// Render Products
function renderProducts() {
  const filteredProducts = getFilteredProducts()
  const grid = document.getElementById("productsGrid")
  grid.innerHTML = ""

  filteredProducts.forEach((product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id)
    const card = createProductCard(product, isInWishlist)
    grid.appendChild(card)
  })
}

// Create Product Card
function createProductCard(product, isInWishlist) {
  const card = document.createElement("div")
  card.className = "product-card"

  const starsHTML = "★".repeat(Math.floor(product.rating)) + (product.rating % 1 !== 0 ? "½" : "")

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <span class="stars">${starsHTML}</span>
                <span class="reviews">(${product.reviews})</span>
            </div>
            <div class="product-price">$${product.price}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="add-wishlist-btn ${isInWishlist ? "added" : ""}" 
                        onclick="toggleWishlist(${product.id}, this)">
                    ${isInWishlist ? "❤ Added" : "♡ Wishlist"}
                </button>
            </div>
        </div>
    `

  return card
}

// Toggle Wishlist
function toggleWishlist(productId, button) {
  const product = products.find((p) => p.id === productId)
  const index = wishlist.findIndex((item) => item.id === productId)

  if (index > -1) {
    wishlist.splice(index, 1)
    button.classList.remove("added")
    button.textContent = "♡ Wishlist"
  } else {
    wishlist.push(product)
    button.classList.add("added")
    button.textContent = "❤ Added"
  }

  updateWishlistCount()
  saveWishlist()
}

// Update Wishlist Count
function updateWishlistCount() {
  document.getElementById("wishlistCount").textContent = wishlist.length
}

// Save Wishlist to LocalStorage
function saveWishlist() {
  localStorage.setItem("makeup-wishlist", JSON.stringify(wishlist))
}

// Load Wishlist from LocalStorage
function loadWishlist() {
  const saved = localStorage.getItem("makeup-wishlist")
  if (saved) {
    wishlist = JSON.parse(saved)
    updateWishlistCount()
  }
}

// View Wishlist
function viewWishlist() {
  const modal = document.getElementById("wishlistModal")
  const wishlistItems = document.getElementById("wishlistItems")

  if (wishlist.length === 0) {
    wishlistItems.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Your wishlist is empty</p>'
  } else {
    wishlistItems.innerHTML = wishlist
      .map(
        (item) => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">$${item.price}</div>
                <button class="remove-wishlist-btn" onclick="removeFromWishlist(${item.id})">Remove</button>
            </div>
        `,
      )
      .join("")
  }

  modal.style.display = "block"
}

// Close Wishlist Modal
function closeWishlist() {
  document.getElementById("wishlistModal").style.display = "none"
}

// Remove from Wishlist
function removeFromWishlist(productId) {
  wishlist = wishlist.filter((item) => item.id !== productId)
  updateWishlistCount()
  saveWishlist()
  viewWishlist()
  renderProducts()
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const cartCount = document.querySelector(".cart-count")
  const currentCount = Number.parseInt(cartCount.textContent)
  cartCount.textContent = currentCount + 1

  if (!cartItems[productId]) {
    cartItems[productId] = 0
  }
  cartItems[productId]++

  // Update quantity display on product card
  const quantityDisplay = document.getElementById(`qty-${productId}`)
  if (quantityDisplay) {
    quantityDisplay.textContent = `+${cartItems[productId]}`
    quantityDisplay.classList.add("active")
  }

  console.log(`Added ${product.name} to cart. Total quantity: ${cartItems[productId]}`)
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("wishlistModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}
