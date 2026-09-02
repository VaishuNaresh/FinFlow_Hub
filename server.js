import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(express.json());// why we use express.json() because we are sending data in json format from frontend so we need to parse it in backend
app.use(cookieParser());// why we use cookie parser  because we are sending refresh token in cookie so we need to parse it in backend

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // why we use credentials true because we are sending cookie from frontend to backend so we need to allow it in backend
    // credentials: true mainly for allowing cookies to be sent in cross-origin requests. When the frontend and backend are on different domains or ports, 
    // browsers block cookies by default for security reasons. 
    // By setting credentials: true, we tell the browser that it's safe to include cookies in requests to the backend, 
    // enabling session management and authentication features that rely on cookies.

}));
app.use("/uploads", express.static("uploads"));// why we use express.static()
// because we are uploading images in uploads folder so we need to make it static so that browser can access it
//first we have to create uploads folder in root directory and then we have to make it static so that browser can access it

//Without this, browser cannot open uploaded image.
// WHY EXPRESS.STATIC ?

//     Suppose image path is:

// uploads / 123.png

// Browser needs URL access.

// So Express converts:

// http://localhost:5000/uploads/123.png

// into accessible image URL.


app.use("/api/auth", authRoutes);//why do we use app.use() because we are using express router in authRoutes.js so we need to use it in server.js
//this is type of middleware called router middleware
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use(
    "/api/income",
    incomeRoutes
);

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);


// WHY ACCESS TOKEN IN JSON ?

//     Frontend needs it immediately.

// Usually stored in:

// memory / redux / zustand

// NOT localStorage ideally.