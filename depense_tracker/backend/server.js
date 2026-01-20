const express = require("express");
const app = express();

app.use(express.json());

let expenses = [];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

app.post("/api/expenses", (req, res) => {
  const { amount, category, description, date } = req.body;

  if (!amount || !category || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const expense = {
    id: expenses.length + 1,
    amount,
    category,
    description,
    date,
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

app.delete("/api/expenses/:id", (req, res) => {
  expenses = expenses.filter((e) => e.id !== Number(req.params.id));
  res.status(204).end();
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
