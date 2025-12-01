document.addEventListener('DOMContentLoaded', () => {
    // Check if the necessary elements are on the page before running the script
    const menuItemsContainer = document.getElementById('menu-items');
    if (!menuItemsContainer) {
        // Not on the menu page, so don't run the rest of the script
        return;
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const placeOrderButton = document.getElementById('place-order');
    const tableModal = document.getElementById('table-modal');
    const closeButton = document.querySelector('.close-button');
    const confirmOrderButton = document.getElementById('confirm-order');
    const tableNumberSelect = document.getElementById('table-number');
    const goToBottomButton = document.getElementById('go-to-bottom');

    let cart = [];

    // Function to scroll to the bottom of the page
    if (goToBottomButton) {
        goToBottomButton.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // Populate table numbers from 1 to 20
    if (tableNumberSelect) {
        for (let i = 1; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            tableNumberSelect.appendChild(option);
        }
    }

    // Fetch menu items from Firestore
    db.collection('menu').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const category = doc.data();
            if (category.items && Array.isArray(category.items)) {
                category.items.forEach(item => {
                    const itemName = item.name;
                    let itemPrice = item.price;

                    // Ensure price is a number
                    if (typeof itemPrice === 'string') {
                        itemPrice = parseFloat(itemPrice);
                    }

                    // Skip items that are missing essential data
                    if (!itemName || typeof itemPrice !== 'number' || isNaN(itemPrice)) {
                        console.error('Skipping invalid menu item:', item);
                        return; // Continue to the next item
                    }

                    const itemElement = document.createElement('div');
                    itemElement.classList.add('menu-item');
                    itemElement.innerHTML = `
                        <h3>${itemName}</h3>
                        <p>${item.description || ''}</p>
                        <p class="price">₹${itemPrice.toFixed(2)}</p>
                        <button class="btn add-to-cart" data-id="${item.id || doc.id}" data-name="${itemName}" data-price="${itemPrice}">Add to Cart</button>
                    `;
                    menuItemsContainer.appendChild(itemElement);
                });
            }
        });
    }).catch(error => {
        console.error("Error fetching menu items: ", error);
        menuItemsContainer.innerHTML = '<p>Could not load menu items. Please try again later.</p>';
    });

    // Add to cart functionality
    menuItemsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('add-to-cart')) {
            const item = {
                id: event.target.dataset.id,
                name: event.target.dataset.name,
                price: parseFloat(event.target.dataset.price)
            };
            cart.push(item);
            renderCart();
        }
    });

    // Render cart items and update total
    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;
        cart.forEach((item, index) => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name}</span>
                <span>₹${item.price.toFixed(2)}</span>
                <button class="btn-remove" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            totalPrice += item.price;
        });
        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    }
    
    // Remove from cart
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', event => {
            if (event.target.classList.contains('btn-remove')) {
                const index = parseInt(event.target.dataset.index, 10);
                cart.splice(index, 1);
                renderCart();
            }
        });
    }

    // Show table selection modal
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }
            if (tableModal) {
                tableModal.classList.remove('hidden');
            }
        });
    }

    // Hide modal
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (tableModal) {
                tableModal.classList.add('hidden');
            }
        });
    }
    window.addEventListener('click', event => {
        if (event.target === tableModal) {
            if (tableModal) {
                tableModal.classList.add('hidden');
            }
        }
    });
    
    // Confirm and place order
    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', () => {
            const tableNumber = tableNumberSelect.value;
            if (!tableNumber) {
                alert('Please select a table number.');
                return;
            }
            
            const order = {
                tableNumber: parseInt(tableNumber, 10),
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price, 0),
                status: 'Pending', // Initial status
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            db.collection('orders').add(order).then((docRef) => {
                // Save the order ID to session storage
                sessionStorage.setItem('latestOrderId', docRef.id);
                
                alert('Order placed successfully!');
                cart = [];
                renderCart();
                if (tableModal) {
                    tableModal.classList.add('hidden');
                }
                // Redirect to the tracking page
                window.location.href = 'tracking.html';
            }).catch(error => {
                console.error('Error placing order:', error);
                alert('Could not place order. Please try again.');
            });
        });
    }
});
