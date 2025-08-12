import express from 'express';
import { Op } from 'sequelize';
import { Lead, User, Company, Activity } from '../models/index.js';
import { leadValidation } from '../validations/lead.js';

const router = express.Router();

// Get all leads
router.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { organizationId: req.user.organizationId };

    // Apply filters
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { rows: leads, count } = await Lead.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['firstName', 'lastName'] },
        { model: Company, as: 'company', attributes: ['name'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get lead by ID
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, organizationId: req.user.organizationId },
      include: [
        { model: User, as: 'assignedUser', attributes: ['firstName', 'lastName'] },
        { model: Company, as: 'company' },
        { model: Activity, as: 'activities', include: [{ model: User, as: 'creator', attributes: ['firstName', 'lastName'] }] }
      ]
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
});

// Create lead
router.post('/', leadValidation.create, async (req, res, next) => {
  try {
    const leadData = {
      ...req.body,
      organizationId: req.user.organizationId
    };

    const lead = await Lead.create(leadData);

    // Create activity log
    await Activity.create({
      type: 'Note',
      subject: 'Lead Created',
      description: `Lead created for ${lead.firstName} ${lead.lastName}`,
      createdBy: req.user.id,
      leadId: lead.id,
      organizationId: req.user.organizationId
    });

    // Emit socket event for real-time updates
    req.io.emit('lead_created', { lead, createdBy: req.user.id });

    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
});

// Update lead
router.put('/:id', leadValidation.update, async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, organizationId: req.user.organizationId }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const oldStatus = lead.status;
    await lead.update(req.body);

    // Log status change activity
    if (oldStatus !== lead.status) {
      await Activity.create({
        type: 'Status Change',
        subject: 'Lead Status Updated',
        description: `Status changed from ${oldStatus} to ${lead.status}`,
        createdBy: req.user.id,
        leadId: lead.id,
        organizationId: req.user.organizationId
      });

      // Emit socket event
      req.io.emit('lead_updated', { lead, updatedBy: req.user.id });
    }

    res.json(lead);
  } catch (error) {
    next(error);
  }
});

// Delete lead
router.delete('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, organizationId: req.user.organizationId }
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.destroy();
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;