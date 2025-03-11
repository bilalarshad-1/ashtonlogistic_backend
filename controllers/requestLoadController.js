const RequestLoad = require('../models/RequestLoad');
const nodemailer = require('nodemailer');
require("dotenv").config();

exports.submitRequestLoad = async (req, res) => {
    try {
        const { name, companyName, mcNumber, phoneNumber, email, truckType, zipCode, preferredStates, additionalInfo, imageUrl } = req.body;

        const requestLoad = new RequestLoad({ name, companyName, mcNumber, phoneNumber, email, truckType, zipCode });
        await requestLoad.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        transporter.verify((error, success) => {
            if (error) {
                console.log('Transporter Error:', error);
            } else {
                console.log('Server is ready to send emails');
            }
        });

        const mailOptions = {
            from: `"Ashton Logistics" <${process.env.EMAIL}>`,
            to: email,
            subject: '🚛 Load Request Received – Our Team is On It!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #1a73e8; text-align: center;">🚛 Ashton Logistics Services</h2>
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>We appreciate your request for load options! Our experienced dispatch team is already reviewing your details and will reach out shortly.</p>
                    <ul>
                        <li>📞 A dispatcher will contact you soon.</li>
                        <li>📋 We’ll match you with the best available loads.</li>
                        <li>🚀 Quick & hassle-free dispatching.</li>
                    </ul>
                    <p>If you need immediate assistance, reply to this email or call us directly.</p>
                    <p style="text-align: center;">
                        📞 <a href="tel:+1234567890" style="color: #1a73e8;">+1 (234) 567-890</a> <br>
                        📧 <a href="mailto:support@yourcompany.com" style="color: #1a73e8;">support@yourcompany.com</a>
                    </p>
                </div>
            `,
        };

        const adminMailOptions = {
            from: `"Ashton Logistics" <${process.env.EMAIL}>`, 
            to: "adam.ashtondispatch@gmail.com",
            subject: 'New Form Submission',
            html: `
                <h2>New Form Submission Received</h2>
                <p><b>Company Name:</b> ${companyName || 'N/A'}</p>
                <p><b>MC Number:</b> ${mcNumber || 'N/A'}</p>
                <p><b>Truck Type:</b> ${truckType || 'N/A'}</p>
                <p><b>Name:</b> ${name || 'N/A'}</p>
                <p><b>Email:</b> ${email || 'N/A'}</p>
                <p><b>Phone:</b> ${phoneNumber || 'N/A'}</p>
                <p><b>Zip Code:</b> ${zipCode || 'N/A'}</p>
                ${preferredStates ? `<p><b>Preferred States:</b> ${preferredStates}</p>` : ''}
                ${additionalInfo ? `<p><b>Additional Info:</b> ${additionalInfo}</p>` : ''}
                ${imageUrl ? `<p><b>Uploaded File:</b> <a href="${imageUrl}" target="_blank">View Image</a></p>` : ''}
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log("User email sent successfully");
        } catch (error) {
            console.error("Error sending user email:", error);
        }

        try {
            await transporter.sendMail(adminMailOptions);
            console.log("Admin email sent successfully");
        } catch (error) {
            console.error("Error sending admin email:", error);
        }

        res.status(200).json({ message: 'Request Load submitted successfully. Email sent.' });
    } catch (error) {
        console.error("Error submitting request load:", error);
        res.status(500).json({ error: 'Error submitting request load' });
    }
};

exports.getAllRequestLoads = async (req, res) => {
    try {
        const requests = await RequestLoad.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching request loads' });
    }
};
