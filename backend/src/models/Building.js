const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.ENUM('finalizado', 'proyecto'),
    allowNull: false,
    defaultValue: 'finalizado',
  },
  sizeM2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'size_m2',
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'cover_image',
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
  },
}, {
  tableName: 'buildings',
  underscored: true,
  timestamps: true,
});

module.exports = Building;
