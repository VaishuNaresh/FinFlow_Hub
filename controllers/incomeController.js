import ExcelJS from "exceljs";
import Income from "../models/Income.js";


// CREATE INCOME
export const createIncome =
    async (req, res) => {

        try {

            const {
                icon,
                source,
                amount,
                date
            } = req.body;

            const income =
                await Income.create({

                    icon,
                    source,
                    amount,
                    date,
                    user: req.user._id
                });

            res.status(201).json(income);

        }

        catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };



// DOWNLOAD INCOME AS EXCEL
export const downloadIncome =
    async (req, res) => {

        try {

            const incomes =
                await Income.find({

                    user: req.user._id

                }).sort({

                    createdAt: -1

                });

            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Income");

            sheet.columns = [
                { header: "Icon", key: "icon", width: 10 },
                { header: "Source", key: "source", width: 25 },
                { header: "Amount", key: "amount", width: 15 },
                { header: "Date", key: "date", width: 20 },
            ];

            incomes.forEach((item) => {
                sheet.addRow({
                    icon: item.icon,
                    source: item.source,
                    amount: item.amount,
                    date: item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "",
                });
            });

            sheet.getRow(1).font = { bold: true };

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=income.xlsx"
            );

            await workbook.xlsx.write(res);
            res.end();

        }

        catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };



// GET ALL INCOMES
export const getIncomes =
    async (req, res) => {

        try {

            const incomes =
                await Income.find({

                    user: req.user._id

                }).sort({

                    createdAt: -1

                });

            res.json(incomes);

        }

        catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };