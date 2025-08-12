import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('Call', 'Email', 'Meeting', 'Note', 'Task', 'Deal Update', 'Status Change'),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  duration: {
    type: DataTypes.INTEGER // in minutes
  },
  outcome: {
    type: DataTypes.STRING
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  contactId: {
    type: DataTypes.UUID,
    references: {
      model: 'Contacts',
      key: 'id'
    }
  },
  leadId: {
    type: DataTypes.UUID,
    references: {
      model: 'Leads',
      key: 'id'
    }
  },
  opportunityId: {
    type: DataTypes.UUID,
    references: {
      model: 'Opportunities',
      key: 'id'
    }
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Activity;