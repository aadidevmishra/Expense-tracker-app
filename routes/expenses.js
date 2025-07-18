// server/routes/expenses.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Expense = require("../models/Expense");

// --- Get all expenses for the logged-in user ---
router.get("/", auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({
            date: -1,
        });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Add a new expense ---
router.post("/", auth, async (req, res) => {
    const { description, amount, category } = req.body;

    try {
        const newExpense = new Expense({
            user: req.user.id,
            description,
            amount,
            category,
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// --- Delete an expense ---
router.delete("/:id", auth, async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: "Expense not found" });

        // Make sure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Not authorized" });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.json({ msg: "Expense removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
