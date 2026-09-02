import express from "express";

import {
    createIncome,
    getIncomes,
    downloadIncome
}
    from "../controllers/incomeController.js";

import {
    protect
}
    from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE
router.post(
    "/",
    protect,// router middleware is used to protect the route so that only logged in user can access it
    createIncome
);


// GET
router.get(
    "/",
    protect,
    getIncomes
);

// DOWNLOAD EXCEL
router.get(
    "/download",
    protect,
    downloadIncome
);

export default router;