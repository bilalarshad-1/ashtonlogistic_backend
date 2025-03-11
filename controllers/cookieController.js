const User = require('../models/User');

// Get user preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (user) {
      res.json({
        cookieConsent: user.cookieConsent,
        analyticsCookies: user.analyticsCookies,
        marketingCookies: user.marketingCookies,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Save user preferences
exports.savePreferences = async (req, res) => {
  try {
    const { userId, cookieConsent, analyticsCookies, marketingCookies } = req.body;
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId });
    }

    user.cookieConsent = cookieConsent;
    user.analyticsCookies = analyticsCookies || false;
    user.marketingCookies = marketingCookies || false;

    await user.save();
    res.json({ message: 'Preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};