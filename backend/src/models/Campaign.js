import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Email', 'Social Media', 'Direct Mail', 'Event', 'Webinar', 'Other'),
    defaultValue: 'Email'
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Scheduled', 'Active', 'Paused', 'Completed'),
    defaultValue: 'Draft'
  },
  subject: {
    type: DataTypes.STRING
  },
  content: {
    type: DataTypes.TEXT
  },
  targetAudience: {
    type: DataTypes.JSONB // Store segmentation criteria
  },
  scheduledDate: {
    type: DataTypes.DATE
  },
  sentDate: {
    type: DataTypes.DATE
  },
  createdBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  // Analytics fields
  recipientCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  openCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  organizationId: {
    type: DataTypes.UUID,
    allowNull: false
  }
});

export default Campaign;