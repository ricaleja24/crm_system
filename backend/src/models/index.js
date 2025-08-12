import { sequelize } from '../config/database.js';
import User from './User.js';
import Contact from './Contact.js';
import Lead from './Lead.js';
import Company from './Company.js';
import Opportunity from './Opportunity.js';
import Task from './Task.js';
import Activity from './Activity.js';
import Campaign from './Campaign.js';

// Define associations
User.hasMany(Lead, { foreignKey: 'assignedTo', as: 'assignedLeads' });
User.hasMany(Opportunity, { foreignKey: 'assignedTo', as: 'assignedOpportunities' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });
User.hasMany(Activity, { foreignKey: 'createdBy', as: 'activities' });
User.hasMany(Campaign, { foreignKey: 'createdBy', as: 'campaigns' });

Contact.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Contact.hasMany(Activity, { foreignKey: 'contactId', as: 'activities' });

Lead.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
Lead.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Lead.hasMany(Activity, { foreignKey: 'leadId', as: 'activities' });

Company.hasMany(Contact, { foreignKey: 'companyId', as: 'contacts' });
Company.hasMany(Lead, { foreignKey: 'companyId', as: 'leads' });
Company.hasMany(Opportunity, { foreignKey: 'companyId', as: 'opportunities' });

Opportunity.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
Opportunity.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Opportunity.hasMany(Activity, { foreignKey: 'opportunityId', as: 'activities' });

Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Activity.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Activity.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });
Activity.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
Activity.belongsTo(Opportunity, { foreignKey: 'opportunityId', as: 'opportunity' });

Campaign.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

export {
  sequelize,
  User,
  Contact,
  Lead,
  Company,
  Opportunity,
  Task,
  Activity,
  Campaign
};