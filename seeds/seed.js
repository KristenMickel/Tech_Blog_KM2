const sequelize = require('../config/connection');
const { User, BlogEntry } = require('../models');

const userData = require('./userData.json');
const projectData = require('./blogentryData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const blogentry of blogentryData) {
    await BlogEntry.create({
      ...blogentry,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();