const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  companyName: {
     type: String,
      required: true
     },
  mcNumber: {
      type: String,
      required: true 
    },
  truckType: { 
     type: String,
     required: true 
    },
  name: {
      type: String,
      required: true 
    },
  email: {
      type: String,
      required: true
     },
  phoneNumber: {
      type: String,
      required: true
     },
  zipCode: {
      type: String,
      required: true
     },
  preferredStates: {
     type: String 
    },
  additionalInfo: {
     type: String },
  imageUrl: {
     type: String
     },
});

module.exports = mongoose.model('Contact', contactSchema);
