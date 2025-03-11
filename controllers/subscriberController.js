const Subscriber = require("../models/Subscriber");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD,
    },
});


exports.subscribeUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required!" });
    }

    try {
      
        let subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            subscriber = new Subscriber({ email });
            await subscriber.save();
        }

      
        const pdfPath = path.join(__dirname, "../uploads/document.pdf");


        const mailOptions = {
            from: `"Ashton Logistics" <${process.env.EMAIL}>`,
            to: email,
            subject: "📦 Welcome to Ashton Logistics – Your Exclusive Guide Inside!",
            
            text: `Dear Valued Partner,
        
        We are thrilled to welcome you to Ashton Logistics! 
        
        As a trusted leader in logistics and supply chain solutions, we are committed to providing you with seamless services and operational excellence. 
        
        Attached, you'll find your exclusive Ashton Logistics Welcome Guide, designed to help you navigate our services effortlessly.
        
        If you have any questions or need assistance, feel free to reach out to our dedicated support team.
        
        Best regards,  
        The Ashton Logistics Team  
        📧 support@ashtonlogistics.com  
        🌐 www.ashtonlogistics.com`,
        
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #0047AB; text-align: center;">📦 Welcome to Ashton Logistics!</h2>
                    <p style="font-size: 16px; color: #333;">
                        Dear Valued Partner,
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        We are delighted to have you on board! At <strong>Ashton Logistics</strong>, we take pride in delivering exceptional logistics and supply chain solutions to our esteemed clients.
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        Attached is your exclusive <strong>Ashton Logistics Welcome Guide</strong>, designed to help you navigate our services and offerings.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://www.ashtonlogistics.com" 
                           style="background-color: #0047AB; color: #fff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                           Explore Our Services
                        </a>
                    </div>
                    <p style="font-size: 16px; color: #333;">
                        If you have any questions, our dedicated support team is here to assist you.  
                        <a href="mailto:support@ashtonlogistics.com" style="color: #0047AB;">Contact us now</a>.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 14px; color: #666; text-align: center;">
                        Best regards,  
                        <br><strong>The Ashton Logistics Team</strong>  
                        <br>📧 <a href="mailto:support@ashtonlogistics.com" style="color: #0047AB;">support@ashtonlogistics.com</a>  
                        <br>🌐 <a href="https://www.ashtonlogistics.com" style="color: #0047AB;">www.ashtonlogistics.com</a>
                    </p>
                </div>
            `,
        
            attachments: [
                {
                    filename: "Ashton_Logistics_Welcome_Guide.pdf",  
                    path: pdfPath, 
                    contentType: "application/pdf"
                }
            ]
        };
        
        
        

       
        await transporter.sendMail(mailOptions);

        res.json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Something went wrong!", error });
    }
};
