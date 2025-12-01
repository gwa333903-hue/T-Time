document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');

    function attachCompleteOrderListener(btn) {
        btn.addEventListener('click', () => {
            const orderId = btn.dataset.orderId;
            db.collection('orders').doc(orderId).update({
                status: 'completed'
            }).then(() => {
                console.log('Order completed successfully');
            }).catch(error => {
                console.error('Error completing order:', error);
                alert('Error completing order.');
            });
        });
    }

    function createOrderElement(order) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order';
        orderDiv.dataset.orderId = order.id;

        const orderTime = order.timestamp.toDate().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        const itemCounts = order.items.reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + 1;
            return acc;
        }, {});

        orderDiv.innerHTML = `
            <h3>Table: ${order.tableNumber}</h3>
            <p>Total Price: ${order.total.toFixed(2)}</p>
            <p><small>Order Time: ${orderTime}</small></p>
            <ul>
                ${Object.entries(itemCounts).map(([name, quantity]) => `<li>${name} x ${quantity}</li>`).join('')}
            </ul>
            <button class="complete-order-btn" data-order-id="${order.id}">Order Complete</button>
        `;

        attachCompleteOrderListener(orderDiv.querySelector('.complete-order-btn'));
        return orderDiv;
    }

    db.collection('orders')
        .where('status', '==', 'Pending')
        .onSnapshot(snapshot => {
            ordersContainer.innerHTML = '';
            if (snapshot.empty) {
                ordersContainer.innerHTML = '<p>No pending orders found.</p>';
                return;
            }
            snapshot.forEach(doc => {
                const order = { ...doc.data(), id: doc.id };
                const orderElement = createOrderElement(order);
                ordersContainer.appendChild(orderElement);
            });
        }, error => {
            console.error('Error fetching orders:', error);
            ordersContainer.innerHTML = '<p>Error fetching orders.</p>';
        });
});
