document.addEventListener('DOMContentLoaded', () => {
    const ordersContainer = document.getElementById('orders-container');

    fetch('/api/orders/history')
        .then(response => response.json())
        .then(orders => {
            if (orders.length === 0) {
                ordersContainer.innerHTML = '<p>No completed orders found.</p>';
                return;
            }

            const ordersHtml = orders.map(order => `
                <div class="order">
                    <h3>Order ID: ${order.id}</h3>
                    <p><strong>Table:</strong> ${order.table_number}</p>
                    <p><strong>Customer:</strong> ${order.customer_name}</p>
                    <p><strong>Total Price:</strong> ${order.total_price}</p>
                    <p><strong>Order Time:</strong> ${new Date(order.order_time).getFullYear()}-${new Date(order.order_time).getMonth()+1}-${new Date(order.order_time).getDate()} ${new Date(order.order_time).getHours()}:${new Date(order.order_time).getMinutes()}</p>
                    <ul>
                        ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            ordersContainer.innerHTML = ordersHtml;
        })
        .catch(error => {
            console.error('Error fetching order history:', error);
            ordersContainer.innerHTML = '<p>Error fetching order history.</p>';
        });
});
