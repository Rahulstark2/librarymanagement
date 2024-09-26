const express = require('express');
const adminRouter = require("./admin");
const userRouter = require("./user");
const transactionRouter = require("./transaction")
const reportsRouter = require("./reports.js")


const router = express.Router();

router.use("/admin", adminRouter);
router.use("/user",userRouter)
router.use("/transaction",transactionRouter)
router.use("/reports", reportsRouter)


module.exports = router;