const fs = require('fs');
const mysql = require('mysql2');

// Database connection configuration (without specifying a database initially)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '2030350667Aa',
  multipleStatements: true // Allow multiple SQL statements
};

// Read the SQL file
const sql = fs.readFileSync('php/setup.sql', 'utf8');

// Create a connection to the database
const connection = mysql.createConnection(dbConfig);

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server.');

  // Execute the SQL script
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing SQL script:', err);
      connection.end();
      return;
    }
    console.log('Database setup script executed successfully.');
    connection.end();
  });
});
