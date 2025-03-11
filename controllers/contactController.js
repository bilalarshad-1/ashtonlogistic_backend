const Contact = require('../models/contactModel');
const cloudinary = require('../config/cloudinaryConfig');
const nodemailer = require('nodemailer');
const multer = require('multer');
require("dotenv").config()


const storage = multer.memoryStorage();
const upload = multer({ storage });

  const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL, 
              pass: process.env.EMAIL_PASSWORD,
          },
      });
      



const submitForm = async (req, res) => {
  try {
    const {
      companyName,
      mcNumber,
      truckType,
      name,
      email,
      phoneNumber,
      zipCode,
      preferredStates,
      additionalInfo,
    } = req.body;

    let imageUrl = '';

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

  
    const newContact = new Contact({
      companyName,
      mcNumber,
      truckType,
      name,
      email,
      phoneNumber,
      zipCode,
      preferredStates,
      additionalInfo,
      imageUrl,
    });

    await newContact.save();

  
    const mailOptions = {
        from: `"Ashton Logistics" <${process.env.EMAIL}>`,
        to: email, 
        subject: 'Dispatch Service - Form Submission Confirmation',
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to our dispatching team. We have received your information and are currently reviewing your details.</p>
          <p>One of our dispatch specialists will contact you shortly to discuss the best freight opportunities tailored to your needs.</p>
          <p>If you have any urgent questions, feel free to reply to this email.</p>
          <p>We look forward to working with you!</p>
          <p>Best regards,</p>
          <p><b>Truck Dispatching Team</b></p>
        `,
      };

    const adminMailOptions = {
      from: `"Ashton Logistics" <${process.env.EMAIL}>`,
      to:   "adam.ashtondispatch@gmail.com",
      subject: 'New Form Submission',
      html: `
        <h2>New Form Submission Received</h2>
        <p><b>Company Name:</b> ${companyName}</p>
        <p><b>MC Number:</b> ${mcNumber}</p>
        <p><b>Truck Type:</b> ${truckType}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phoneNumber}</p>
        <p><b>Zip Code:</b> ${zipCode}</p>
        <p><b>Preferred States:</b> ${preferredStates}</p>
        <p><b>Additional Info:</b> ${additionalInfo}</p>
        ${imageUrl ? `<p><b>Uploaded File:</b> <a href="${imageUrl}" target="_blank">View Image</a></p>` : ''}
      `,
    };

  
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(201).json({ message: 'Form submitted successfully, and emails sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { submitForm, getAllContacts, upload };
