import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, // because we want to store the id of the user who created the expense and
        // we are using mongoose to store the id of the user who created the expense and we are using ObjectId to store the id of the user
        //  who created the expense that why we use reference:user
        

        ref: "User"
    }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);