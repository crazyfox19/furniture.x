// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || []

// Update cart count in header
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count')
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  if (cartCount) {
    cartCount.textContent = totalItems
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Add to cart functionality
function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', function () {
      const productId = this.getAttribute('data-id')
      const productName = this.getAttribute('data-name')
      const productPrice = parseFloat(this.getAttribute('data-price'))
      const productImage = this.getAttribute('data-image')

      // Check if product already in cart
      const existingItem = cart.find((item) => item.id === productId)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        cart.push({
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        })
      }

      // Update cart count
      updateCartCount()

      // Save cart to localStorage
      saveCart()

      // Update cart display if on cart page
      if (window.location.pathname.includes('cart.html')) {
        updateCartDisplay()
      }

      // Show notification
      showNotification('Product added to cart successfully!')
    })
  })
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById('notification')
  if (notification) {
    notification.querySelector('span').textContent = message
    notification.classList.add('show')

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show')
    }, 3000)
  }
}

// Update cart display
function updateCartDisplay() {
  const cartItemsContainer = document.querySelector('.cart-items')
  const cartTotalAmount = document.getElementById('cart-total-amount')
  const emptyCartMessage = document.querySelector('.empty-cart-message')

  if (cartItemsContainer) {
    // Clear current cart items
    cartItemsContainer.innerHTML = ''

    if (cart.length === 0) {
      // Show empty cart message
      if (emptyCartMessage) {
        cartItemsContainer.appendChild(emptyCartMessage.cloneNode(true))
      }
    } else {
      // Add each item to cart
      cart.forEach((item) => {
        const cartItem = document.createElement('div')
        cartItem.className = 'cart-item'
        cartItem.innerHTML = `
                    <img src="${item.image}" alt="${
          item.name
        }" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(
                          2
                        )}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${
                              item.id
                            }">-</button>
                            <input type="number" class="quantity-input" value="${
                              item.quantity
                            }" min="1" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${
                              item.id
                            }">+</button>
                        </div>
                    </div>
                `
        cartItemsContainer.appendChild(cartItem)
      })
    }

    // Calculate and update total
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    if (cartTotalAmount) {
      cartTotalAmount.textContent = `$${total.toFixed(2)}`
    }

    // Add event listeners to quantity buttons
    setupQuantityButtons()
  }
}

// Setup quantity buttons
function setupQuantityButtons() {
  // Plus buttons
  document.querySelectorAll('.quantity-btn.plus').forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id')
      const item = cart.find((item) => item.id === id)
      if (item) {
        item.quantity += 1
        saveCart()
        updateCartDisplay()
        updateCartCount()
      }
    })
  })

  // Minus buttons
  document.querySelectorAll('.quantity-btn.minus').forEach((btn) => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id')
      const item = cart.find((item) => item.id === id)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        saveCart()
        updateCartDisplay()
        updateCartCount()
      }
    })
  })

  // Quantity inputs
  document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('change', function () {
      const id = this.getAttribute('data-id')
      const item = cart.find((item) => item.id === id)
      if (item) {
        const newQuantity = parseInt(this.value)
        if (newQuantity > 0) {
          item.quantity = newQuantity
          saveCart()
          updateCartDisplay()
          updateCartCount()
        } else {
          this.value = item.quantity
        }
      }
    })
  })
}

// Checkout button functionality
function setupCheckoutButton() {
  const checkoutBtn = document.querySelector('.checkout-btn')
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (cart.length === 0) {
        showNotification(
          'Your cart is empty. Please add some items before checking out.'
        )
      } else {
        showNotification(
          'Thank you for your order! Your items will be shipped soon.'
        )
        cart = []
        saveCart()
        updateCartDisplay()
        updateCartCount()
      }
    })
  }
}

// Product filter functionality
function setupProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn')
  const productCards = document.querySelectorAll('.product-card')

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove('active'))
      // Add active class to clicked button
      this.classList.add('active')

      const filter = this.getAttribute('data-filter')

      productCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block'
        } else {
          card.style.display = 'none'
        }
      })
    })
  })
}

// Image slider functionality
function setupImageSlider() {
  const slider = document.querySelector('.slider')
  const slides = document.querySelectorAll('.slide')
  const dots = document.querySelectorAll('.slider-dot')

  if (slider && slides.length > 0) {
    let currentSlide = 0

    function showSlide(n) {
      currentSlide = (n + slides.length) % slides.length
      slider.style.transform = `translateX(-${currentSlide * 100}%)`

      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide)
      })
    }

    // Auto slide every 5 seconds
    setInterval(() => {
      showSlide(currentSlide + 1)
    }, 5000)

    // Dot click events
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index)
      })
    })
  }
}

// Contact form submission
function setupContactForm() {
  const contactForm = document.getElementById('contactForm')
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault()
      showNotification(
        'Thank you for your message! We will get back to you soon.'
      )
      this.reset()
    })
  }
}

// Header scroll effect
function setupHeaderScroll() {
  window.addEventListener('scroll', function () {
    const header = document.querySelector('header')
    if (header) {
      if (window.scrollY > 100) {
        header.style.padding = '5px 0'
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'
      } else {
        header.style.padding = '15px 0'
        header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'
      }
    }
  })
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount()
  setupAddToCartButtons()
  updateCartDisplay()
  setupCheckoutButton()
  setupProductFilters()
  setupImageSlider()
  setupContactForm()
  setupHeaderScroll()
})
