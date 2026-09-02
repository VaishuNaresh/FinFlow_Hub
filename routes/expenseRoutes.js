import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { createExpense, deleteExpense, getExpenses } from "../controllers/ExpenseController.js";
import { logAction } from "../middleware/auditMiddleware.js";

const router = express.Router();

router.get("/", protect, getExpenses);
router.post("/", protect, createExpense);

router.delete(
    "/:id",
    protect, 
    checkPermission("CAN_DELETE_EXPENSE"),// is a route middleware that checks if the user has the required permission to delete an expense
    //.It uses the checkPermission function from the permissionMiddleware.js file, which checks if the user's role has the specified permission.
    
    logAction("DELETE_EXPENSE"),
    deleteExpense
);

export default router;