const express = require('express');
const adminRouter = require("./admin");
const userRouter = require("./user");


const router = express.Router();

router.use("/admin", adminRouter);
router.use("/user",userRouter)


module.exports = router;