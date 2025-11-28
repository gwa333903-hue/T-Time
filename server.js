const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2030350667Aa',
  database: 't_time_cafe'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// API endpoint
app.get('/api', (req, res) => {
  const { action } = req.query;

  if (action === 'get_menu') {
    db.query('SELECT * FROM menu_items ORDER BY category, name', (err, results) => {
      if (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      const itemsByCategory = {};
      results.forEach(item => {
        if (!itemsByCategory[item.category]) {
          itemsByCategory[item.category] = [];
        }
        itemsByCategory[item.category].push(item);
      });
      res.json(itemsByCategory);
    });
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
});

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/orders', (req, res) => {
    const query = `
        SELECT o.id AS order_id, o.table_number, o.total_price, oi.quantity, mi.name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN menu_items mi ON oi.item_id = mi.id
        WHERE o.status = 'Pending'
        ORDER BY o.id DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const orders = {};
        results.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    id: row.order_id,
                    table_number: row.table_number,
                    total_price: row.total_price,
                    items: []
                };
            }
            orders[row.order_id].items.push({
                name: row.name,
                quantity: row.quantity
            });
        });

        res.json(Object.values(orders));
    });
});

// Staff login
app.post('/staff-login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'ttt' && password === '700800900') {
        req.session.user = username;
        res.redirect('/order_control.html');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Order control page
app.get('/order_control', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'order_control.html'));
    } else {
        res.redirect('/login.html');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/staff-dashboard');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login.html');
    });
});



app.post('/api/order', (req, res) => {
  const { table_number, cart } = req.body;
  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;
  });

  db.query('INSERT INTO orders (table_number, total_price) VALUES (?, ?)', [table_number, totalPrice], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const orderId = result.insertId;
    const orderItems = cart.map(item => [orderId, item.id, item.quantity]);

    db.query('INSERT INTO order_items (order_id, item_id, quantity) VALUES ?', [orderItems], (err, result) => {
      if (err) {
        console.error('Error inserting order items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      db.query('UPDATE tables SET status = ? WHERE table_number = ?', ['occupied', table_number], (err, result) => {
        if (err) {
          console.error('Error updating table status:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        res.json({ success: true, order_id: orderId });
      });
    });
  });
});

app.post('/api/orders/complete', (req, res) => {
    const { order_id } = req.body;

    // Directly update the order status to 'Complete'
    db.query('UPDATE orders SET status = ? WHERE id = ?', ['Complete', order_id], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Optionally, you can still update the table status if needed
        // For now, just confirming the order completion is enough
        res.json({ success: true });
    });
});

app.get('/api/orders/history', (req, res) => {
    const query = `
        SELECT o.id AS order_id, o.table_number, o.total_price, o.order_time, oi.quantity, mi.name AS item_name
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN menu_items mi ON oi.item_id = mi.id
        WHERE o.status = 'Complete'
        ORDER BY o.order_time DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching order history:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const orders = {};
        results.forEach(row => {
            if (!orders[row.order_id]) {
                orders[row.order_id] = {
                    id: row.order_id,
                    table_number: row.table_number,
                    total_price: row.total_price,
                    order_time: row.order_time,
                    items: []
                };
            }
            orders[row.order_id].items.push({
                name: row.item_name,
                quantity: row.quantity
            });
        });

        res.json(Object.values(orders));
    });
});

app.use((req, res) => {
  console.log(`404 Not Found: ${req.path}`);
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
