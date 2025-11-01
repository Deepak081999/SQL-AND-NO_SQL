import express from "express";
import pool from "../db/mysql.js";

const router = express.Router();


// ✅ Run SQL Query
router.post("/sql", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "No SQL query provided." });

    try {
        console.log("🟢 Running SQL:", query);
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("❌ SQL Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get table data (Customers, Orders, Shippings)
router.get("/sql/table/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const [rows] = await pool.query(`SELECT * FROM ${name} LIMIT 10`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Failed to fetch table ${name}` });
    }
});


export default router;
