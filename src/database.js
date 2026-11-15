
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./garage.db");

db.serialize(() => {

    // Mechanics table
    db.run(`
        CREATE TABLE IF NOT EXISTS mechanics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    `);

    // Bays table
    db.run(`
        CREATE TABLE IF NOT EXISTS bays (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            vehicle TEXT NOT NULL
        )
    `);

    // Assignments table
    db.run(`
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mechanic_id INTEGER NOT NULL,
            bay_id INTEGER NOT NULL,
            status TEXT DEFAULT 'active',
            FOREIGN KEY (mechanic_id) REFERENCES mechanics(id),
            FOREIGN KEY (bay_id) REFERENCES bays(id)
        )
    `);

    // Sample data
    db.run(
        "INSERT OR IGNORE INTO mechanics (name) VALUES (?)",
        ["Asha"]
    );

    db.run(
        "INSERT INTO bays (name, vehicle) VALUES (?, ?)",
        ["Bay 1", "Swift"]
    );

    console.log("Database tables created successfully!");
});

module.exports = db;
