require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const sequelize = require('./src/config/database');

// load all models (order matters for associations)
require('./src/models/User');
require('./src/models/Category');
require('./src/models/Shop');
require('./src/models/Product');
require('./src/models/Listing');
require('./src/models/Order');
require('./src/models/OrderItem');
require('./src/models/Notification');
require('./src/models/Subscription');
require('./src/models/Chat');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/listings', require('./src/routes/listings'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/shops', require('./src/routes/shops'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/notifications', require('./src/routes/notifications'));
app.use('/api/subscriptions', require('./src/routes/subscriptions'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/chat', require('./src/routes/chat'));

app.get('/', (req, res) => res.json({ message: 'BuySellOrRent API running', docs: '/api-docs' }));

const PORT = process.env.PORT || 8000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tables synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => { console.error('DB connection failed:', err.message); process.exit(1); });
