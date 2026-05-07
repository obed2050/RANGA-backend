require('dotenv').config();
const sequelize = require('./config/database');

const runMigration = async () => {
  await sequelize.authenticate();
  console.log('DB connected');

  const qi = sequelize.getQueryInterface();

  const safeAddColumn = async (table, column, definition) => {
    try {
      await qi.addColumn(table, column, definition);
      console.log(`✅ Added column: ${table}.${column}`);
    } catch (err) {
      if (err.original?.code === 'ER_DUP_FIELDNAME') {
        console.log(`⏭️  Column already exists: ${table}.${column}`);
      } else {
        console.error(`❌ Failed ${table}.${column}:`, err.message);
      }
    }
  };

  const { DataTypes } = require('sequelize');

  // listings - add missing columns safely
  await safeAddColumn('listings', 'whatsapp', { type: DataTypes.STRING, allowNull: true });
  await safeAddColumn('listings', 'phone',    { type: DataTypes.STRING, allowNull: true });
  await safeAddColumn('listings', 'images',   { type: DataTypes.JSON,   allowNull: true });

  // shops - add missing columns safely
  await safeAddColumn('shops', 'banner', { type: DataTypes.STRING, allowNull: true });

  // notifications - ensure table exists
  await safeAddColumn('notifications', 'referenceId', { type: DataTypes.INTEGER, allowNull: true });

  console.log('\n✅ Migration completed!');
  process.exit(0);
};

runMigration().catch((err) => { console.error(err); process.exit(1); });
