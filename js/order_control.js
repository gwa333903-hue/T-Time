document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');

    function attachCompleteOrderListener(btn) {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            fetch(`/api/orders/complete/${orderId}`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const orderElement = btn.closest('.order');
                    if (orderElement) {
                        orderElement.remove();
                    }
                } else {
                    alert('Failed to complete order.');
                }
            })
            .catch(error => {
                console.error('Error completing order:', error);
                alert('Error completing order.');
            });
        });
    }

    function createOrderElement(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.dataset.orderId = order.id;

        // Format the timestamp to IST
        const orderTime = new Date(order.order_time).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        orderDiv.innerHTML = `
            <h3>Table: ${order.table_number}</h3>
            <p>Total Price: ${order.total_price}</p>
            <p><small>Order Time: ${orderTime}</small></p>
            <ul>
                ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
            </ul>
            <button class="complete-order-btn" data-order-id="${order.id}">Order Complete</button>
        `;

        attachCompleteOrderListener(orderDiv.querySelector('.complete-order-btn'));
        return orderDiv;
    }

    function updateOrders(newOrders) {
        const displayedOrderIds = new Set([...ordersContainer.querySelectorAll('.order')].map(el => el.dataset.orderId));
        const newOrderIds = new Set(newOrders.map(o => o.id.toString()));

        // Remove orders that are no longer active
        for (const orderElement of ordersContainer.querySelectorAll('.order')) {
            if (!newOrderIds.has(orderElement.dataset.orderId)) {
                orderElement.remove();
            }
        }

        // Add new orders
        newOrders.forEach(order => {
            if (!displayedOrderIds.has(order.id.toString())) {
                const orderElement = createOrderElement(order);
                ordersContainer.appendChild(orderElement);
            }
        });

        if (ordersContainer.children.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
        } else {
            // Remove "No orders found" message if it exists
            const noOrdersP = ordersContainer.querySelector('p');
            if (noOrdersP && noOrdersP.textContent === 'No orders found.') {
                noOrdersP.remove();
            }
        }
    }
    
    async function fetchOrders() {
        try {
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const orders = await response.json();
            updateOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (!ordersContainer.querySelector('.order')) {
                 ordersContainer.innerHTML = '<p>Error fetching orders.</p>';
            }
        }
    }

    fetchOrders(); // Fetch orders on initial load
    setInterval(fetchOrders, 5000); // Refresh every 5 seconds
});
