const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  cookieConsent: { type: String, enum: ['accepted', 'rejected', 'custom'],  },
  analyticsCookies: { type: Boolean,  },
  marketingCookies: { type: Boolean, },
});

module.exports = mongoose.model('User', userSchema);