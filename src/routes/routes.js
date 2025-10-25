const express = require('express');
const router = express();

const authRouter = require('./auth');
const profileRouter = require('./profile');
const requestRouter = require('./request');

router.use("/auth",authRouter);
router.use("/profile",profileRouter);
router.use("/request",requestRouter);

module.exports = router;