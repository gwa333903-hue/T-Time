<?php
$servername = "localhost";
$username = "root"; // <-- IMPORTANT: Replace with your database username
$password = "";     // <-- IMPORTANT: Replace with your database password
$dbname = "t_time_cafe";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
