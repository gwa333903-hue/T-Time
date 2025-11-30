const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 't_time_cafe'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// API routes
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT id, table_number, total_price, DATE_FORMAT(order_time, '%Y-%m-%d %H:%i:%s') as order_time, status 
        FROM orders 
        WHERE status NOT IN ('completed', 'cancelled') 
        ORDER BY order_time ASC
    `;
    db.query(query, (err, orders) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const promises = orders.map(order => {
            return new Promise((resolve, reject) => {
                const itemsQuery = `
                    SELECT mi.name, oi.quantity 
                    FROM order_items oi 
                    JOIN menu_items mi ON oi.item_id = mi.id 
                    WHERE oi.order_id = ?
                `;
                db.query(itemsQuery, [order.id], (err, items) => {
                    if (err) {
                        return reject(err);
                    }
                    order.items = items;
                    resolve(order);
                });
            });
        });

        Promise.all(promises)
            .then(completedOrders => {
                res.json(completedOrders);
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
});

app.post('/api/orders/complete/:id', (req, res) => {
    const orderId = req.params.id;
    const query = "UPDATE orders SET status = 'completed' WHERE id = ?";
    db.query(query, [orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Order not found.' });
        }
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
