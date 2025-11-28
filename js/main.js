document.addEventListener('DOMContentLoaded', () => {
    // Code for menu page
    if (document.getElementById('menu-items')) {
        populateTableNumbers();
        fetchMenu();

        const modal = document.getElementById('table-modal');
        const placeOrderBtn = document.getElementById('place-order');
        const closeBtn = document.querySelector('.close-button');
        const confirmOrderBtn = document.getElementById('confirm-order');

        placeOrderBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            modal.classList.remove('hidden');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.classList.add('hidden');
            }
        });

        confirmOrderBtn.addEventListener('click', placeOrder);
    }

    // Code for tracking page
    if (document.getElementById('order-status-container')) {
        displayOrderStatus();
        const orderMoreBtn = document.getElementById('order-more');
        if (orderMoreBtn) {
            orderMoreBtn.addEventListener('click', () => {
                window.location.href = 'menu.html';
            });
        }
    }

    const goToBottomBtn = document.getElementById('go-to-bottom');
    if (goToBottomBtn) {
        goToBottomBtn.addEventListener('click', () => {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        });
    }
});

function populateTableNumbers() {
    const tableSelect = document.getElementById('table-number');
    const defaultOption = document.createElement('option');
    defaultOption.value = "0";
    defaultOption.textContent = "Select your table";
    tableSelect.appendChild(defaultOption);

    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Table ${i}`;
        tableSelect.appendChild(option);
    }
}

function fetchMenu() {
    const menuCategories = {
        "Tea": [
            { "id": 1, "name": "Lal chai", "price": "10.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 2, "name": "Lebu cahi", "price": "10.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 3, "name": "Green tea", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 4, "name": "Milk tea (Small)", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 5, "name": "Milk tea (Large)", "price": "30.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 6, "name": "Special Tea", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Tea" },
            { "id": 7, "name": "Coffee (Small)", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
            { "id": 8, "name": "Coffee (Large)", "price": "30.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
            { "id": 9, "name": "Special Coffee", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" },
            { "id": 10, "name": "Black Coffee", "price": "20.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Coffee" }
        ],
        "Snacks": [
            { "id": 11, "name": "Chicken Pakora", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 12, "name": "Chicken Lollipop", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 13, "name": "Chicken Cutlet", "price": "35.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 14, "name": "Chicken Sate", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 15, "name": "Panir Tikka", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 16, "name": "Lachha Porota", "price": "15.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" },
            { "id": 17, "name": "Chicken Fry", "price": "140.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Snacks" }
        ],
        "Momo": [
            { "id": 18, "name": "Steam Momo", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
            { "id": 19, "name": "Fry Momo", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
            { "id": 20, "name": "Pan Fry Momo", "price": "90.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
            { "id": 21, "name": "Chili Momo", "price": "110.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" },
            { "id": 22, "name": "Cheese Momo", "price": "99.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Momo" }
        ],
        "Chowmein": [
            { "id": 23, "name": "Egg Chowmein (Full)", "price": "70.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 24, "name": "Egg Chowmein (Half)", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 25, "name": "Chicken Chowmein (Full)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 26, "name": "Chicken Chowmein (Half)", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 27, "name": "Paneer Chowmein (Full)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 28, "name": "Paneer Chowmein (Half)", "price": "50.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 29, "name": "Veg Chowmein", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" },
            { "id": 30, "name": "Supie Nuduls", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein" }
        ],
        "Rolls": [
            { "id": 31, "name": "Egg Laccha Roll", "price": "40.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" },
            { "id": 32, "name": "Egg Chicken Laccha Roll", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" },
            { "id": 33, "name": "Paneer Laccha Roll", "price": "90.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Rolls" }
        ],
        "Pizza": [
            { "id": 34, "name": "Chicken Pizza (Large)", "price": "150.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
            { "id": 35, "name": "Chicken Pizza (Small)", "price": "100.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
            { "id": 36, "name": "Paneer Pizza (Large)", "price": "170.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
            { "id": 37, "name": "Paneer Pizza (Small)", "price": "120.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
            { "id": 38, "name": "Veg Pizza (Large)", "price": "120.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" },
            { "id": 39, "name": "Veg Pizza (Small)", "price": "80.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Pizza" }
        ],
        "Burger": [
            { "id": 40, "name": "Chicken Burger", "price": "60.00", "image_url": "https://placehold.co/150x150/d2b48c/5a463a?text=Burger" }
        ]
    };

    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; // Clear existing items

    for (const category in menuCategories) {
        const categorySection = document.createElement('div');
        categorySection.className = 'menu-category';
        categorySection.innerHTML = `<h2>${category}</h2>`;

        const menuGrid = document.createElement('div');
        menuGrid.className = 'menu-grid';

        menuCategories[category].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
                <img src="${item.image_url}" alt="${item.name}" referrerpolicy="no-referrer">
                <h3>${item.name}</h3>
                <p>₹${parseFloat(item.price).toFixed(2)}</p>
                <button class="btn add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
            `;
            menuGrid.appendChild(itemDiv);
        });

        categorySection.appendChild(menuGrid);
        menuContainer.appendChild(categorySection);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

let cart = [];

function addToCart(event) {
    const button = event.target;
    const item = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        quantity: 1
    };

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn-remove" data-id="${item.id}">Remove</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);

    // Add event listeners to the new remove buttons
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(event) {
    const button = event.target;
    const itemId = button.dataset.id;

    const itemIndex = cart.findIndex(cartItem => cartItem.id === itemId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
}

async function placeOrder() {
    const tableNumber = document.getElementById('table-number').value;
    if (tableNumber === "0") {
        alert('Please select a table number.');
        return;
    }

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table_number: tableNumber, cart: cart })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            localStorage.setItem('orderId', result.order_id);
            localStorage.setItem('orderStatus', 'Pending');
            window.location.href = 'tracking.html';
        } else {
            alert('There was an error placing your order: ' + result.message);
        }
    } catch (error) {
        console.error("Could not place order:", error);
        alert('There was a network error placing your order. Please try again.');
    }
}

function displayOrderStatus() {
    const orderId = localStorage.getItem('orderId');
    const orderStatus = localStorage.getItem('orderStatus');

    if (orderId && orderStatus) {
        document.getElementById('order-id').textContent = orderId;
        document.getElementById('order-status').textContent = orderStatus;
    }
}
