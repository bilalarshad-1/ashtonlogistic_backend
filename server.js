const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes.js');
const requestLoadRoutes = require('./routes/requestLoadRoutes.js');
const subscriberRoutes = require("./routes/subscriberRoutes");
const emailRoutes = require("./routes/emailRoutes");
const cookieRoutes = require('./routes/cookieRoutes');

dotenv.config();
const app = express();


connectDB();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/contact', contactRoutes);
app.use('/api/load', requestLoadRoutes);
app.use("/api/subscribe", subscriberRoutes);
app.use("/api/email", emailRoutes);
app.use('/api/cookie', cookieRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
