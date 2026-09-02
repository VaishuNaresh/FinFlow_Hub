import mongoose from "mongoose";
const incomeSchema =
    new mongoose.Schema({
        icon: String,

        source: String,

        amount: Number,

        date: Date,

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    });

    export default mongoose.model("Income", incomeSchema);