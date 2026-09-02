import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, role} = req.body;
        const image = req.file?.path;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "USER",
            image,
            permissions:
                role === "ADMIN"
                    ? ["CAN_EDIT_EXPENSE", "CAN_DELETE_EXPENSE"]
                    : [],
        });

        res.status(201).json({
            message: "User registered successfully",
            newUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/* ===========================
   REFRESH TOKEN
=========================== */
// Why needed ?
//     Because access token expires.
// So frontend sends refresh token cookie.
export const refreshAccessToken = async (req, res) => {
    // const { token } = req.body;
    const token =
        req.cookies.refreshToken;

    if (!token)
        return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(
            token,

            // process.env.JWT_REFRESH_SECRET
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token)
        //     return res.status(403).json({ message: "Invalid refresh token" });
        // token version check
        // if (
        //     user.tokenVersion !==
        //     decoded.tokenVersion
        // ) 
        {
            return res.status(401).json({
                message:
                    "Refresh token revoked"
            });
        }

        // const newAccessToken = generateAccessToken(user);
        // const newRefreshToken = generateRefreshToken(user);

        // user.refreshToken = newRefreshToken;
        // await user.save();

        // res.json({
        //     accessToken: newAccessToken,
        //     refreshToken: newRefreshToken,
        // });
        const accessToken =
            generateAccessToken(user);

        res.json({
            accessToken
        });

    } catch (err) {
        res.status(403).json({ message: "Token expired or invalid" });
    }
};

/* ===========================
   LOGOUT
=========================== */
export const logoutUser = async (req, res) => {

        try {

            const token =
                req.cookies.refreshToken;

            if (token) {

                const user =
                    await User.findOne({
                        refreshToken: token
                    });

                if (user) {

                    user.refreshToken = "";

                    await user.save();

                }

            }

            res.clearCookie("refreshToken");

            res.json({
                message:
                    "Logged out successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };

