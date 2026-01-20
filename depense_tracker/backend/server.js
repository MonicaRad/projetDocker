const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database schema ready");
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/expenses", async (req, res) => {
  const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
  res.json(result.rows);
});

app.post("/api/expenses", async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const result = await pool.query(
    `INSERT INTO expenses (amount, category, description, date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [amount, category, description || null, date],
  );

  res.status(201).json(result.rows[0]);
});

app.delete("/api/expenses/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM expenses WHERE id = $1", [id]);

  res.status(204).end();
});

initDb()
  .then(() => {
    app.listen(3000, () => console.log("Backend running"));
  })
  .catch((err) => {
    console.error("Database init failed", err);
    process.exit(1);
  });
