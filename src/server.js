
const express = require("express");
const db = require("./database");

const app = express();
app.use(express.json());

// HOME
app.get("/", (req, res) => {
    res.json({ message: "Welcome to AutoFix Garage API" });
});

// ---------------- MECHANICS ----------------

// Get all mechanics
app.get("/api/mechanics", (req, res) => {
    db.all("SELECT * FROM mechanics", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
});

// Add mechanic
app.post("/api/mechanics", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    db.run(
        "INSERT INTO mechanics (name) VALUES (?)",
        [name],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({
                message: "Mechanic added",
                id: this.lastID
            });
        }
    );
});

// ---------------- BAYS ----------------

// Get all bays + vehicle search
app.get("/api/bays", (req, res) => {
    const vehicle = req.query.vehicle;

    let sql = "SELECT * FROM bays";
    let params = [];

    if (vehicle) {
        sql += " WHERE vehicle LIKE ?";
        params.push(`%${vehicle}%`);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
});

// Get one bay
app.get("/api/bays/:id", (req, res) => {
    db.get(
        "SELECT * FROM bays WHERE id = ?",
        [req.params.id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: "Bay not found" });
            res.status(200).json(row);
        }
    );
});

// Add bay
app.post("/api/bays", (req, res) => {
    const { name, vehicle } = req.body;

    if (!name || !vehicle) {
        return res.status(400).json({
            error: "Bay name and vehicle are required"
        });
    }

    db.run(
        "INSERT INTO bays (name, vehicle) VALUES (?, ?)",
        [name, vehicle],
        function(err) {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({
                message: "Bay added successfully",
                id: this.lastID
            });
        }
    );
});

// Update bay
app.put("/api/bays/:id", (req, res) => {
    const { name, vehicle } = req.body;

    if (!name || !vehicle) {
        return res.status(400).json({
            error: "Bay name and vehicle are required"
        });
    }

    db.run(
        "UPDATE bays SET name = ?, vehicle = ? WHERE id = ?",
        [name, vehicle, req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: "Bay not found" });
            }
            res.status(200).json({ message: "Bay updated successfully" });
        }
    );
});

// Delete bay
app.delete("/api/bays/:id", (req, res) => {
    db.run(
        "DELETE FROM bays WHERE id = ?",
        [req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) {
                return res.status(404).json({ error: "Bay not found" });
            }
            res.status(200).json({ message: "Bay deleted successfully" });
        }
    );
});

// ---------------- ASSIGNMENTS ----------------

// Get assignments with mechanic and bay names (JOIN)
app.get("/api/assignments", (req, res) => {
    const sql = `
        SELECT assignments.id, mechanics.name AS mechanic_name,
        bays.name AS bay_name, bays.vehicle, assignments.status
        FROM assignments
        JOIN mechanics ON assignments.mechanic_id = mechanics.id
        JOIN bays ON assignments.bay_id = bays.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
});

// Create assignment (maximum 3 active per mechanic)
app.post("/api/assignments", (req, res) => {
    const { mechanic_id, bay_id } = req.body;

    if (!mechanic_id || !bay_id) {
        return res.status(400).json({
            error: "Mechanic ID and Bay ID are required"
        });
    }

    db.get(
        "SELECT COUNT(*) AS total FROM assignments WHERE mechanic_id = ? AND status = 'active'",
        [mechanic_id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row.total >= 3) {
                return res.status(409).json({
                    error: "Limit of 3 reached"
                });
            }

            db.run(
                "INSERT INTO assignments (mechanic_id, bay_id) VALUES (?, ?)",
                [mechanic_id, bay_id],
                function(err) {
                    if (err) return res.status(400).json({ error: err.message });

                    res.status(201).json({
                        message: "Assignment created",
                        id: this.lastID
                    });
                }
            );
        }
    );
});

// Return an assignment (frees one active place)
app.patch("/api/assignments/:id/return", (req, res) => {
    db.run(
        "UPDATE assignments SET status = 'returned' WHERE id = ? AND status = 'active'",
        [req.params.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Active assignment not found"
                });
            }

            res.status(200).json({
                message: "Assignment returned successfully"
            });
        }
    );
});

// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
