require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/project');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// Middleware pentru fișiere statice
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

// Setare SendGrid
const sendGridApiKey = process.env.SENDGRID_TOKEN;
if (!sendGridApiKey) {
  console.error('SendGrid API key is missing.');
  process.exit(1);
}
sgMail.setApiKey(sendGridApiKey);

// Conectare la baza de date
connectDB();

// CORS
app.use(
  cors({
    origin: ['https://taskpro-frontend.onrender.com', 'http://localhost:5000'],
    credentials: true,
  })
);

// Middleware-uri globale
app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rute
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);

// Pornire server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
