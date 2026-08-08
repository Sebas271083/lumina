const sequelize = require('../config/db');
const User = require('./User');
const Building = require('./Building');
const Lead = require('./Lead');
const SiteContent = require('./SiteContent');

module.exports = {
  sequelize,
  User,
  Building,
  Lead,
  SiteContent,
};
