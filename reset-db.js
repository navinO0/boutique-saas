const { Sequelize } = require('sequelize');
const config = require('./backend/src/config/config.json').development;

async function resetDB() {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  });

  try {
    await sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Wishlists" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "CatalogItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "OrderItems" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Orders" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Products" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Users" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Companies" CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS "enum_Users_role" CASCADE;');
    await sequelize.query('DROP TYPE IF EXISTS "enum_Orders_status" CASCADE;');
    console.log('Database tables cleared successfully.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await sequelize.close();
  }
}

resetDB();
