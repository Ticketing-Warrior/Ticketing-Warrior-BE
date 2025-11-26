CREATE TABLE IF NOT EXISTS history (
    id INT NOT NULL AUTO_INCREMENT,
    duration_ms INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Optional: frequently queried by time
CREATE INDEX idx_history_created_at ON history (created_at);
