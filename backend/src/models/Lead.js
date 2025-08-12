import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING
  },
  companyId: {
    type: DataTypes.UUID,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('New', 'Contacted', 'Qualified', 'Converted', 'Lost'),
    defaultValue: 'New'
  },
  source: {
    type: DataTypes.STRING
  },
  assignedTo: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(10, 2)
  },
  expectedCloseDate: {
    type: DataTypes.DATE
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Lead;