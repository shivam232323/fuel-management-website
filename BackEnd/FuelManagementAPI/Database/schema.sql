-- Create Users Table
CREATE TABLE
    IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create Dispensing Records Table
CREATE TABLE
    IF NOT EXISTS dispensing_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        dispenser_no VARCHAR(10) NOT NULL,
        quantity DECIMAL(10, 2) NOT NULL,
        vehicle_number VARCHAR(50) NOT NULL,
        payment_mode VARCHAR(20) NOT NULL,
        payment_proof_filename VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- Insert default user (username: admin, password: admin123)
-- Password hashed using bcrypt (you can generate your own using an online bcrypt tool or during login)
INSERT INTO
    users (username, password)
VALUES
    (
        'admin',
        '$2a$12$GNRWB6y088tuS4HEPcZB3eHI47qoBhSCjRWUSTWO6yKCAvJt.QWNu'
    ) ON DUPLICATE KEY
UPDATE id = id;

-- Create indexes for better query performance
CREATE INDEX idx_user_id ON dispensing_records (user_id);

CREATE INDEX idx_dispenser_no ON dispensing_records (dispenser_no);

CREATE INDEX idx_payment_mode ON dispensing_records (payment_mode);

CREATE INDEX idx_created_at ON dispensing_records (created_at);