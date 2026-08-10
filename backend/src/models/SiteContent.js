const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Bloques de contenido editable para paginas institucionales (institucional, sustentabilidad)
const SiteContent = sequelize.define('SiteContent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blockKey: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'block_key',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'image_url',
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
  },
}, {
  tableName: 'site_content',
  underscored: true,
  timestamps: true,
  indexes: [
    { unique: true, fields: ['page', 'block_key'] },
  ],
});

module.exports = SiteContent;
