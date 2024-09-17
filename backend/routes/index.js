const express = require('express');
const adminRouter = require("./admin");


const router = express.Router();

router.use("/admin", adminRouter);


module.exports = router;