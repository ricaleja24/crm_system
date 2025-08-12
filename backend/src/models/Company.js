import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  website: {
    type: DataTypes.STRING
  },
  industry: {
    type: DataTypes.STRING
  },
  size: {
    type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
  },
  revenue: {
    type: DataTypes.DECIMAL(15, 2)
  },
  address: {
    type: DataTypes.TEXT
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  zipCode: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Company;