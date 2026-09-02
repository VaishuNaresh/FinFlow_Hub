import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { createUser, getAllUsers } from "../controllers/userController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router();

/**
 * ADMIN ONLY
 * Create a new user (Employee / Admin)
 */
router.post(
    "/",
    protect,                 // 1️⃣ User must be logged in
    authorizeRole("ADMIN"),  // 2️⃣ Only ADMIN can access
    upload.single("image"),
    createUser               // 3️⃣ Controller logic
);

/**
 * ADMIN ONLY
 * Get all users
 */
router.get(
    "/",
    protect,
    authorizeRole("ADMIN"),// this is router middleware which is used to protect the route so that only logged in user can access it
    getAllUsers
);

export default router;