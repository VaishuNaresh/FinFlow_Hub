import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
             required: true,
        },

        role: {
            type: String,
            enum: ["ADMIN", "USER"],
            default: "USER",
        },

        permissions: {
            type: [String],
            enum: ["CAN_EDIT_EXPENSE", "CAN_DELETE_EXPENSE"]// why  do we use enum here
            // because we want to restrict the permissions to only these two values. 
            // Enum allows us to define a set of allowed values for a field, 
            // ensuring that only valid permissions can be assigned to a user.
        },

        refreshToken: {
            type: String,
        },
        //why we use token version here because
        //we want to invalidate the refresh token when user logs out or when user changes password.
        //why refresh token not invalidate automatically because we are storing refresh token in cookie and 
        // cookie is not deleted when user logs out or when user changes password.
        // tokenVersion: {
        //     type: Number,
        //     default: 0
        // },
        image:String// why we store image as string because we are storing image path in database and image path is string
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);