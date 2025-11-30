<?php
header("Content-Type: application/json");
include 'db_connect.php';

$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Simple router
if ($method === 'GET' && $request_uri === '/api/orders') {
    getOrders($conn);
} elseif ($method === 'POST' && preg_match('/\/api\/orders\/complete\/(\d+)/', $request_uri, $matches)) {
    $orderId = $matches[1];
    completeOrder($conn, $orderId);
} else {
    // Fallback for other actions if they are still needed elsewhere
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    switch ($action) {
        case 'get_menu':
            getMenu($conn);
            break;
        case 'place_order':
            placeOrder($conn);
            break;
        case 'update_status':
            updateStatus($conn);
            break;
        case 'login':
            staffLogin($conn);
            break;
        default:
            echo json_encode(['error' => 'Invalid API endpoint or action']);
    }
}


function getMenu($conn) {
    $result = $conn->query("SELECT * FROM menu_items ORDER BY category, name");
    $itemsByCategory = [];
    while ($row = $result->fetch_assoc()) {
        $itemsByCategory[$row['category']][] = $row;
    }
    echo json_encode($itemsByCategory);
}

function placeOrder($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $tableNumber = $data['table_number'];
    $cart = $data['cart'];
    $totalPrice = 0;

    foreach ($cart as $item) {
        $totalPrice += $item['price'] * $item['quantity'];
    }

    $stmt = $conn->prepare("INSERT INTO orders (table_number, total_price) VALUES (?, ?)");
    $stmt->bind_param("id", $tableNumber, $totalPrice);
    $stmt->execute();
    $orderId = $stmt->insert_id;

    $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)");
    foreach ($cart as $item) {
        $stmt->bind_param("iii", $orderId, $item['id'], $item['quantity']);
        $stmt->execute();
    }

    echo json_encode(['success' => true, 'order_id' => $orderId]);
}

function getOrders($conn) {
    $ordersResult = $conn->query("SELECT id, table_number, total_price, DATE_FORMAT(order_time, '%Y-%m-%d %H:%i:%s') as order_time, status FROM orders WHERE status NOT IN ('completed', 'cancelled') ORDER BY order_time ASC");
    $orders = [];

    while ($order = $ordersResult->fetch_assoc()) {
        $orderId = $order['id'];
        $itemsResult = $conn->query("SELECT mi.name, oi.quantity FROM order_items oi JOIN menu_items mi ON oi.item_id = mi.id WHERE oi.order_id = $orderId");
        
        $items = [];
        while ($item = $itemsResult->fetch_assoc()) {
            $items[] = $item;
        }
        $order['items'] = $items;
        $orders[] = $order;
    }

    echo json_encode($orders);
}

function completeOrder($conn, $orderId) {
    $stmt = $conn->prepare("UPDATE orders SET status = 'completed' WHERE id = ?");
    $stmt->bind_param("i", $orderId);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to complete order.']);
    }
}


function updateStatus($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = $data['order_id'];
    $status = $data['status'];

    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $orderId);
    $stmt->execute();

    echo json_encode(['success' => true]);
}

function staffLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT password FROM staff WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}

$conn->close();
?>
