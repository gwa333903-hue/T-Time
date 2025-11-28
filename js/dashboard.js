document.addEventListener('DOMContentLoaded', () => {
    // Check if on login page or dashboard page
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    } else if (document.getElementById('orders-table')) {
        // Protect the dashboard page
        if (!sessionStorage.getItem('loggedIn')) {
            window.location.href = 'login.html';
            return;
        }
        fetchOrders();
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    const response = await fetch('php/api.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        sessionStorage.setItem('loggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('login-message').textContent = result.message;
    }
}

function handleLogout() {
    sessionStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

async function fetchOrders() {
    const response = await fetch('php/api.php?action=get_orders');
    const orders = await response.json();

    const ordersTbody = document.getElementById('orders-tbody');
    ordersTbody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.table_number}</td>
            <td>${order.items}</td>
            <td>$${order.total_price.toFixed(2)}</td>
            <td>${order.order_time}</td>
            <td>
                <select class="status-select" data-id="${order.id}">
                    <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Served" ${order.status === 'Served' ? 'selected' : ''}>Served</option>
                </select>
            </td>
            <td><button class="btn update-status" data-id="${order.id}">Update</button></td>
        `;
        ordersTbody.appendChild(row);
    });

    document.querySelectorAll('.update-status').forEach(button => {
        button.addEventListener('click', updateOrderStatus);
    });
}

async function updateOrderStatus(event) {
    const orderId = event.target.dataset.id;
    const newStatus = document.querySelector(`.status-select[data-id='${orderId}']`).value;
    
    const response = await fetch('php/api.php?action=update_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
    });

    const result = await response.json();
    if (result.success) {
        alert(`Order ${orderId} status updated to ${newStatus}`);
    } else {
        alert('Failed to update order status.');
    }
}
