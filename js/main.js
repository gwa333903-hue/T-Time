document.addEventListener('DOMContentLoaded', () => {
    const menuItemsContainer = document.getElementById('menu-items');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order');
    const goToBottomButton = document.getElementById('go-to-bottom');

    // Modal elements
    const tableModal = document.getElementById('table-modal');
    const closeButton = document.querySelector('.close-button');
    const confirmOrderButton = document.getElementById('confirm-order');
    const tableNumberSelect = document.getElementById('table-number');

    let cart = [];

    // Populate table numbers
    for (let i = 1; i <= 20; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Table ${i}`;
        tableNumberSelect.appendChild(option);
    }
    
    // Go to the bottom of the page
    goToBottomButton.addEventListener('click', () => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Fetch menu items from Firestore
    const db = firebase.firestore();
    db.collection('menu').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const menuItem = doc.data();
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-item');
            menuItemElement.innerHTML = `
                <img src="${menuItem.imageUrl}" alt="${menuItem.name}">
                <h3>${menuItem.name}</h3>
                <p>₹${menuItem.price.toFixed(2)}</p>
                <button class="add-to-cart btn" data-id="${doc.id}" data-name="${menuItem.name}" data-price="${menuItem.price}">Add to Cart</button>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const name = e.target.dataset.name;
                const price = parseFloat(e.target.dataset.price);
                addToCart({ id, name, price });
            });
        });
    });

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        renderCart();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            totalPrice += item.price * item.quantity;
        });
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    placeOrderButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        tableModal.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        tableModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === tableModal) {
            tableModal.classList.add('hidden');
        }
    });

    confirmOrderButton.addEventListener('click', () => {
        const tableNumber = tableNumberSelect.value;
        if (!tableNumber) {
            alert('Please select a table number.');
            return;
        }

        const order = {
            tableNumber: tableNumber,
            items: cart,
            totalPrice: parseFloat(totalPriceElement.textContent),
            status: 'Pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('orders').add(order).then(() => {
            alert('Order placed successfully!');
            cart = [];
            renderCart();
            tableModal.classList.add('hidden');
        }).catch(error => {
            console.error('Error placing order: ', error);
            alert('Failed to place order. Please try again.');
        });
    });
});
