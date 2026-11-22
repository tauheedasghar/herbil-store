/**
 * HERBIL E-Commerce Cart & Interactive Features
 * Single product price: Rs. 500
 */

const PRODUCT_CONFIG = {
  id: 'herbil-mosquito-repellent-100ml',
  name: 'HERBIL Herbal Mosquito Repellent',
  shortName: 'HERBIL Mosquito Repellent',
  price: 500,
  currency: 'Rs.',
  image: 'assets/herbil/product-bottle.webp',
  size: '100ml / 3.4 fl. oz.'
};

const CART_STORAGE_KEY = 'herbil_cart_v1';

// Get Cart from localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const cart = JSON.parse(raw);
    cart.forEach(item => {
      if (item.id === PRODUCT_CONFIG.id) {
        item.image = PRODUCT_CONFIG.image;
      }
    });
    return cart;
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
}

// Save Cart to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
  updateCartBadges();
  renderCartDrawer();
}

// Add Item to Cart
function addToCart(qty = 1) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === PRODUCT_CONFIG.id);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: PRODUCT_CONFIG.id,
      name: PRODUCT_CONFIG.name,
      price: PRODUCT_CONFIG.price,
      image: PRODUCT_CONFIG.image,
      size: PRODUCT_CONFIG.size,
      quantity: qty
    });
  }
  
  saveCart(cart);
  showToast(`Added ${qty} × HERBIL to cart!`);
  openCartDrawer();
}

// Update quantity of line item
function updateCartItemQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart(cart);
}

// Remove item from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
}

// Update Badge Counts in header
function updateCartBadges() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(badge => {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

// Render Cart Drawer HTML
function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-items');
  const emptyView = document.getElementById('cart-drawer-empty');
  const footer = document.getElementById('cart-drawer-footer');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

  if (!container) return;

  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (totalCount === 0) {
    container.innerHTML = '';
    if (emptyView) emptyView.style.display = 'block';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';
  if (footer) footer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img-box">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4 class="cart-item-name">${item.name}</h4>
        <span class="cart-item-price">${PRODUCT_CONFIG.currency} ${item.price}</span>
        <div class="cart-item-qty-row">
          <div class="cart-mini-qty">
            <button class="cart-mini-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
            <span class="cart-mini-val">${item.quantity}</span>
            <button class="cart-mini-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
      <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">
        ${PRODUCT_CONFIG.currency} ${item.price * item.quantity}
      </div>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `${PRODUCT_CONFIG.currency} ${subtotal.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `${PRODUCT_CONFIG.currency} ${subtotal.toLocaleString()}`;
}

// Open / Close Cart Drawer
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer && backdrop) {
    renderCartDrawer();
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Mobile Menu Drawer
function openMenuDrawer() {
  const drawer = document.getElementById('menu-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeMenuDrawer() {
  const drawer = document.getElementById('menu-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

// Search Modal
function openSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.add('open');
    const input = document.getElementById('search-input');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.remove('open');
}

// Checkout Modal
function openCheckoutModal() {
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (totalCount === 0) {
    showToast('Your cart is empty. Add a product first!');
    return;
  }

  const summaryItemEl = document.getElementById('checkout-summary-item');
  const summaryTotalEl = document.getElementById('checkout-summary-total');

  if (summaryItemEl) {
    summaryItemEl.innerHTML = `
      <span>HERBIL Mosquito Repellent (×${totalCount})</span>
      <span>${PRODUCT_CONFIG.currency} ${subtotal.toLocaleString()}</span>
    `;
  }
  if (summaryTotalEl) {
    summaryTotalEl.textContent = `${PRODUCT_CONFIG.currency} ${subtotal.toLocaleString()}`;
  }

  // Reset form & states
  const form = document.getElementById('checkout-form');
  const success = document.getElementById('order-success-view');
  if (form) form.style.display = 'flex';
  if (success) success.style.display = 'none';

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Handle Checkout Form Submission
function handleCheckoutSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-place-order');
  if (btn) {
    btn.innerHTML = 'Processing Order...';
    btn.disabled = true;
  }

  setTimeout(() => {
    const orderId = 'HRB-' + Math.floor(100000 + Math.random() * 900000);
    const orderIdEl = document.getElementById('order-confirmed-id');
    if (orderIdEl) orderIdEl.textContent = orderId;

    const form = document.getElementById('checkout-form');
    const success = document.getElementById('order-success-view');
    if (form) form.style.display = 'none';
    if (success) success.style.display = 'block';

    // Clear cart
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadges();
    renderCartDrawer();

    if (btn) {
      btn.innerHTML = 'Complete Order';
      btn.disabled = false;
    }
  }, 900);
}

// Buy Now direct trigger
function buyNow() {
  const qtyInput = document.getElementById('pdp-qty-input');
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
  addToCart(qty);
  openCheckoutModal();
}

// Toast Notice
function showToast(msg) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Accordion toggle helper
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('active');

      // Optional: Close others
      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherContent = other.querySelector('.accordion-content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// PDP Quantity Selector controls
function initQtySelectors() {
  const input = document.getElementById('pdp-qty-input');
  const minus = document.getElementById('pdp-qty-minus');
  const plus = document.getElementById('pdp-qty-plus');

  if (!input || !minus || !plus) return;

  minus.addEventListener('click', () => {
    let val = parseInt(input.value) || 1;
    if (val > 1) {
      input.value = val - 1;
    }
  });

  plus.addEventListener('click', () => {
    let val = parseInt(input.value) || 1;
    input.value = val + 1;
  });
}

// Search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchInput || !searchResults) return;

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = `
        <div style="padding: 1rem 0; font-size: 0.88rem; color: var(--text-muted); text-align: center;">
          Type to search our herbal range...
        </div>`;
      return;
    }

    if ('herbil herbal mosquito repellent'.includes(q) || 'repellent'.includes(q) || 'spray'.includes(q) || 'mosquito'.includes(q)) {
      searchResults.innerHTML = `
        <a href="product.html" style="display: flex; align-items: center; gap: 1rem; padding: 0.85rem; border-radius: var(--radius-sm); background: var(--bg-surface-subtle); transition: background 0.2s;">
          <img src="assets/herbil/product-bottle.webp" style="height: 50px; width: 40px; object-fit: contain;">
          <div>
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">HERBIL Herbal Mosquito Repellent</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">Rs. 500 · 100ml</div>
          </div>
        </a>`;
    } else {
      searchResults.innerHTML = `
        <div style="padding: 1.5rem 0; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No matching products found. Try searching for "repellent" or "HERBIL".
        </div>`;
    }
  });
}

// Product Media Gallery Slider (Photo <-> Video)
let currentGallerySlide = 0;

function goToGallerySlide(index) {
  currentGallerySlide = index;
  const track = document.getElementById('gallery-slider-track');
  const video = document.getElementById('product-media-video');
  const dot0 = document.getElementById('dot-0');
  const dot1 = document.getElementById('dot-1');
  const thumb0 = document.getElementById('thumb-0');
  const thumb1 = document.getElementById('thumb-1');

  if (track) {
    track.style.transform = `translateX(-${index * 50}%)`;
  }

  if (dot0 && dot1) {
    dot0.classList.toggle('active', index === 0);
    dot1.classList.toggle('active', index === 1);
  }

  if (thumb0 && thumb1) {
    thumb0.classList.toggle('active', index === 0);
    thumb1.classList.toggle('active', index === 1);
  }

  // Handle Video auto-playback when navigating to video slide
  if (video) {
    if (index === 1) {
      video.play().catch(() => {
        // In case browser policy requires muted autoplay first
        video.muted = true;
        video.play().catch(e => console.log('Autoplay deferred:', e));
      });
    } else {
      video.pause();
    }
  }
}

// Touch and Click Support for Gallery Slider
function initGallerySwipe() {
  const wrap = document.getElementById('gallery-slider-wrap');
  if (!wrap) return;

  let startX = 0;
  let startY = 0;

  wrap.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - startX;
    const diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX < 0) {
        // Swiped left -> Go to video slide
        goToGallerySlide(1);
      } else {
        // Swiped right -> Go to photo slide
        goToGallerySlide(0);
      }
    }
  }, { passive: true });

  // Clicking on photo slide advances to video
  const photoSlide = document.getElementById('slide-photo');
  if (photoSlide) {
    photoSlide.style.cursor = 'pointer';
    photoSlide.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        goToGallerySlide(1);
      }
    });
  }
}

// Mobile Sticky Purchase Bar Observer
function initMobileStickyBar() {
  const stickyBar = document.getElementById('mobile-sticky-bar');
  const mainBtn = document.getElementById('btn-add-cart');
  const waWidget = document.getElementById('whatsapp-widget');
  if (!stickyBar || !mainBtn) return;

  // Use IntersectionObserver with scroll fallback
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyBar.classList.add('visible');
          if (waWidget) waWidget.classList.add('with-sticky-bar');
        } else {
          stickyBar.classList.remove('visible');
          if (waWidget) waWidget.classList.remove('with-sticky-bar');
        }
      });
    }, { threshold: 0.1 });
    observer.observe(mainBtn);
  } else {
    window.addEventListener('scroll', () => {
      const rect = mainBtn.getBoundingClientRect();
      if (rect.bottom < 0) {
        stickyBar.classList.add('visible');
        if (waWidget) waWidget.classList.add('with-sticky-bar');
      } else {
        stickyBar.classList.remove('visible');
        if (waWidget) waWidget.classList.remove('with-sticky-bar');
      }
    }, { passive: true });
  }
}

// Global initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  renderCartDrawer();
  initAccordions();
  initQtySelectors();
  initSearch();
  initGallerySwipe();
  initMobileStickyBar();

  // Backdrop click listener to close all active drawers/modals
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeCartDrawer();
      closeMenuDrawer();
    });
  }

  // Open first accordion by default on product page if present
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    const header = firstAccordion.querySelector('.accordion-header');
    if (header) {
      header.click();
    }
  }
});
