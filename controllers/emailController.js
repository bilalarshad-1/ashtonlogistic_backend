const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Subscriber = require("../models/Subscriber");


const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); 
    },
});
const upload = multer({ storage }).single("attachment"); 


const sendEmailToSubscribers = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: "File upload failed" });
            }

            const { subject, message } = req.body;
            if (!subject || !message) {
                return res.status(400).json({ success: false, message: "Subject and message are required" });
            }

            const subscribers = await Subscriber.find();
            if (subscribers.length === 0) {
                return res.status(400).json({ success: false, message: "No subscribers found" });
            }

            const recipientEmails = subscribers.map((sub) => sub.email);
            const attachmentPath = req.file ? path.join(__dirname, "../uploads/", req.file.filename) : null;

            
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: `"Ashton Logistics" <${process.env.EMAIL}>`,
                to: recipientEmails.join(","),
                subject,
                text: message,
                html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
                attachments: attachmentPath
                    ? [{ filename: req.file.originalname, path: attachmentPath }]
                    : [],
            };

           
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ success: false, message: "Failed to send emails" });
                }
                res.status(200).json({ success: true, message: `Emails sent successfully to ${subscribers.length} subscribers` });
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { sendEmailToSubscribers };
