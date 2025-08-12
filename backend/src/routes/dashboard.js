import express from 'express';
import { Op } from 'sequelize';
import { Lead, Opportunity, Task, Activity, Company } from '../models/index.js';

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Lead metrics
    const totalLeads = await Lead.count({ where: { organizationId } });
    const newLeads = await Lead.count({
      where: {
        organizationId,
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });
    const qualifiedLeads = await Lead.count({
      where: { organizationId, status: 'Qualified' }
    });
    const convertedLeads = await Lead.count({
      where: { organizationId, status: 'Converted' }
    });

    // Opportunity metrics
    const totalOpportunities = await Opportunity.count({ where: { organizationId } });
    const activeOpportunities = await Opportunity.count({
      where: {
        organizationId,
        stage: { [Op.notIn]: ['Closed Won', 'Closed Lost'] }
      }
    });

    const pipelineValue = await Opportunity.sum('value', {
      where: {
        organizationId,
        stage: { [Op.notIn]: ['Closed Won', 'Closed Lost'] }
      }
    }) || 0;

    const wonDeals = await Opportunity.sum('value', {
      where: {
        organizationId,
        stage: 'Closed Won',
        actualCloseDate: { [Op.gte]: thirtyDaysAgo }
      }
    }) || 0;

    // Task metrics
    const pendingTasks = await Task.count({
      where: {
        organizationId,
        status: 'Pending',
        assignedTo: req.user.id
      }
    });

    const overdueTasks = await Task.count({
      where: {
        organizationId,
        status: 'Pending',
        dueDate: { [Op.lt]: now },
        assignedTo: req.user.id
      }
    });

    // Recent activities
    const recentActivities = await Activity.findAll({
      where: { organizationId },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }]
    });

    // Pipeline by stage
    const pipelineByStage = await Opportunity.findAll({
      where: {
        organizationId,
        stage: { [Op.notIn]: ['Closed Won', 'Closed Lost'] }
      },
      attributes: [
        'stage',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('value')), 'value']
      ],
      group: ['stage']
    });

    // Lead conversion funnel
    const leadsByStatus = await Lead.findAll({
      where: { organizationId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    res.json({
      metrics: {
        leads: {
          total: totalLeads,
          new: newLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
          conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0
        },
        opportunities: {
          total: totalOpportunities,
          active: activeOpportunities,
          pipelineValue: parseFloat(pipelineValue),
          wonThisMonth: parseFloat(wonDeals)
        },
        tasks: {
          pending: pendingTasks,
          overdue: overdueTasks
        }
      },
      charts: {
        pipelineByStage,
        leadsByStatus
      },
      recentActivities
    });
  } catch (error) {
    next(error);
  }
});

export default router;