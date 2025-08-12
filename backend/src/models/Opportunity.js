import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Opportunity = sequelize.define('Opportunity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stage: {
    type: DataTypes.ENUM('Prospecting', 'Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'),
    defaultValue: 'Prospecting'
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100
    }
  },
  expectedCloseDate: {
    type: DataTypes.DATE
  },
  actualCloseDate: {
    type: DataTypes.DATE
  },
  companyId: {
    type: DataTypes.UUID,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  source: {
    type: DataTypes.STRING
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

export default Opportunity;