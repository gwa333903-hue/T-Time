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

async function fetchMenu() {
    try {
        const response = await fetch('/api?action=get_menu');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuCategories = await response.json();

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
    } catch (error) {
        console.error("Could not fetch menu:", error);
        const menuContainer = document.getElementById('menu-items');
        menuContainer.innerHTML = '<p>Could not load menu. Please ensure the server is running and the database is set up correctly.</p>';
    }
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
