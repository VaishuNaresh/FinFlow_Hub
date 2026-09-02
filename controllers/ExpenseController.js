import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            createdBy: req.user.id,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ createdBy: req.user.id });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense)
            return res.status(404).json({ message: "Expense not found" });

        if (expense.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN")
            return res.status(403).json({ message: "Not authorized to delete this expense" });

        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
