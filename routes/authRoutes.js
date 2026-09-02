import express from "express";
import {
    register,
    login,
    refreshAccessToken,
    logoutUser,
} from "../controllers/authController.js";
import upload from "../middleware/multerMiddleware.js";

const router = express.Router(); 
router.post("/register", upload.single("image"), register);

// router.get(
//     "/users",
//     protect,
//     authorizeRole("ADMIN"),
//     getAllUsers
// );
//needs accesstoken
router.post("/login", login);
// router.post("/refresh", generateAccessToken);
//in frontend we give this because accesstoken time is low , so it will say login is expired so if we do /refresh again it come
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;

// 35325