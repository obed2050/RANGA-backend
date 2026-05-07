require('dotenv').config();
const sequelize = require('./config/database');
require('./models/User');
require('./models/Category');
require('./models/Shop');
require('./models/Product');
require('./models/Listing');
require('./models/Order');
require('./models/OrderItem');
require('./models/Notification');

sequelize.sync({ alter: false, force: false })
  .then(() => { console.log('✅ Database synced (new tables created, existing tables unchanged)'); process.exit(0); })
  .catch((err) => { console.error(err); process.exit(1); });
