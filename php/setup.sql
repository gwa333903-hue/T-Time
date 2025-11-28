CREATE DATABASE IF NOT EXISTS t_time_cafe;

USE t_time_cafe;

DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `staff`;
DROP TABLE IF EXISTS `tables`;

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `menu_items` (`name`, `price`, `category`, `image_url`) VALUES
('Lal chai', 10.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Lebu cahi', 10.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Green tea', 20.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Milk tea (Small)', 20.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Milk tea (Large)', 30.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Special Tea', 40.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Tea'),
('Coffee (Small)', 20.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Coffee'),
('Coffee (Large)', 30.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Coffee'),
('Special Coffee', 40.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Coffee'),
('Black Coffee', 20.00, 'Tea', 'https://placehold.co/150x150/d2b48c/5a463a?text=Coffee'),
('Chicken Pakora', 50.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Chicken Lollipop', 50.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Chicken Cutlet', 35.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Chicken Sate', 50.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Panir Tikka', 60.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Lachha Porota', 15.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Chicken Fry', 140.00, 'Snacks', 'https://placehold.co/150x150/d2b48c/5a463a?text=Snacks'),
('Steam Momo', 50.00, 'Momo', 'https://placehold.co/150x150/d2b48c/5a463a?text=Momo'),
('Fry Momo', 60.00, 'Momo', 'https://placehold.co/150x150/d2b48c/5a463a?text=Momo'),
('Pan Fry Momo', 90.00, 'Momo', 'https://placehold.co/150x150/d2b48c/5a463a?text=Momo'),
('Chili Momo', 110.00, 'Momo', 'https://placehold.co/150x150/d2b48c/5a463a?text=Momo'),
('Cheese Momo', 99.00, 'Momo', 'https://placehold.co/150x150/d2b48c/5a463a?text=Momo'),
('Egg Chowmein (Full)', 70.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Egg Chowmein (Half)', 40.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Chicken Chowmein (Full)', 100.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Chicken Chowmein (Half)', 50.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Paneer Chowmein (Full)', 100.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Paneer Chowmein (Half)', 50.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Veg Chowmein', 40.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Supie Nuduls', 80.00, 'Chowmein', 'https://placehold.co/150x150/d2b48c/5a463a?text=Chowmein'),
('Egg Laccha Roll', 40.00, 'Rolls', 'https://placehold.co/150x150/d2b48c/5a463a?text=Rolls'),
('Egg Chicken Laccha Roll', 80.00, 'Rolls', 'https://placehold.co/150x150/d2b48c/5a463a?text=Rolls'),
('Paneer Laccha Roll', 90.00, 'Rolls', 'https://placehold.co/150x150/d2b48c/5a463a?text=Rolls'),
('Chicken Pizza (Large)', 150.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Chicken Pizza (Small)', 100.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Paneer Pizza (Large)', 170.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Paneer Pizza (Small)', 120.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Veg Pizza (Large)', 120.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Veg Pizza (Small)', 80.00, 'Pizza', 'https://placehold.co/150x150/d2b48c/5a463a?text=Pizza'),
('Chicken Burger', 60.00, 'Burger', 'https://placehold.co/150x150/d2b48c/5a463a?text=Burger');

CREATE TABLE `tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_number` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'available',
  PRIMARY KEY (`id`)
);

INSERT INTO `tables` (`table_number`, `status`) VALUES
(1, 'available'),
(2, 'available'),
(3, 'available'),
(4, 'available'),
(5, 'available'),
(6, 'available'),
(7, 'available'),
(8, 'available'),
(9, 'available'),
(10, 'available');

CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL UNIQUE,
  `name` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `table_number` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `order_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`)
);

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`item_id`) REFERENCES `menu_items`(`id`)
);

CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Hashed password for 'password' is used here. In a real scenario, generate this hash dynamically.
INSERT INTO `staff` (`username`, `password`) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password is 'password'
