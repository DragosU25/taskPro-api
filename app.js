const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/project');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

dotenv.config();

const app = express();

app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const sendGridApiKey = process.env.SENDGRID_TOKEN;
if (!sendGridApiKey) throw new Error('SendGrid API key is missing.');

sgMail.setApiKey(sendGridApiKey);

//connect to database
connectDB();

// Enable CORS for all origins
app.use(cors());

//middleware
app.use(express.json());

// Apply rate limiter to all requests
// app.use(limiter);

// Use Helmet
app.use(helmet());

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
const PORT = process.env.PORT || 'https://taskpro-api-ca4u.onrender.com';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
