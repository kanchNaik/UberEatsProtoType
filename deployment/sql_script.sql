CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    is_customer TINYINT(1) DEFAULT FALSE,
    is_restaurant TINYINT(1) DEFAULT FALSE,
    email VARCHAR(254) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    is_staff TINYINT(1) NOT NULL,
    is_active TINYINT(1) NOT NULL,
    date_joined DATETIME NOT NULL,
    last_login DATETIME
);

CREATE TABLE Customer (
    user_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    nickname VARCHAR(100),
    date_of_birth DATE,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    profile_image VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Restaurant (
    user_id INT PRIMARY KEY,
    restaurant_name VARCHAR(100),
    location VARCHAR(100),
    description TEXT,
    phone_number VARCHAR(20),
    rating INT,
    image VARCHAR(255),
    price_range TEXT,
    uberone TINYINT(1) DEFAULT FALSE,
    delivery_time TIME,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
);

CREATE TABLE Dish (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    dish_name VARCHAR(100),
    description TEXT,
    price DECIMAL(5, 2),
    category VARCHAR(100),
    dish_image VARCHAR(255),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(user_id) ON DELETE SET NULL
);

CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    dish_id INT,
    quantity INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_still_in_cart TINYINT(1) DEFAULT TRUE,
    order_history_id INT,
    restaurant_id INT,
    FOREIGN KEY (customer_id) REFERENCES Customer(user_id) ON DELETE SET NULL,
    FOREIGN KEY (dish_id) REFERENCES Dish(id) ON DELETE SET NULL,
    FOREIGN KEY (order_history_id) REFERENCES `Order`(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(user_id) ON DELETE SET NULL
);

CREATE TABLE `Order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'New Order',
    total_price DECIMAL(5, 2),
    delivery_address VARCHAR(100),
    customer_id INT,
    restaurant_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    special_notes TEXT,
    FOREIGN KEY (customer_id) REFERENCES Customer(user_id) ON DELETE SET NULL,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(user_id) ON DELETE SET NULL
);

CREATE TABLE Favorite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    restaurant_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(user_id) ON DELETE CASCADE
);

CREATE TABLE User_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES auth_group(id) ON DELETE CASCADE
);

CREATE TABLE User_user_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    permission_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES auth_permission(id) ON DELETE CASCADE
);