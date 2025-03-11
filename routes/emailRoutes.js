const express = require("express");
const { sendEmailToSubscribers } = require("../controllers/emailController");

const router = express.Router();

router.post("/", sendEmailToSubscribers);

module.exports = router;
