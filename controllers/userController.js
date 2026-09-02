import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

/**
 * ADMIN creates user
 */
export const createUser = async (req, res) => {
    try{
    const { name, email, password, role, permissions } = req.body;
    const image = req.file?.path
    //req.file is object
    //req.file.path is string
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        permissions,
        image
    });

    // generate tokens
    const accessToken =
        generateAccessToken(user);

    const refreshToken =
        generateRefreshToken(user);
    // save refresh token in DB
    user.refreshToken = refreshToken;

    await user.save();
    // store refresh token in cookie
    res.cookie(
        "refreshToken",
        refreshToken,
        {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge:
                7 * 24 * 60 * 60 * 1000
        }
    );
    //because of this res.cookie we have to use cookie parser in server
    res.status(201).json({
        message: "User created successfully",
        accessToken,

        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
        }
    });
    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        const accessToken =
            generateAccessToken(user);

        const refreshToken =
            generateRefreshToken(user);

        // update refresh token
        user.refreshToken = refreshToken;

        await user.save();

        res.cookie(
            "refreshToken",
            refreshToken,
            {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge:
                    7 * 24 * 60 * 60 * 1000
            }
        );

        res.json({

            message: "Login successful",

            accessToken,

            user: {

                id: user._id,
                name: user.name,
                role: user.role

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

