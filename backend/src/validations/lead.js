import Joi from 'joi';

const create = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    title: Joi.string().optional(),
    companyId: Joi.string().uuid().optional(),
    source: Joi.string().optional(),
    assignedTo: Joi.string().uuid().optional(),
    estimatedValue: Joi.number().min(0).optional(),
    expectedCloseDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const update = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    title: Joi.string().optional(),
    companyId: Joi.string().uuid().optional(),
    status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Converted', 'Lost').optional(),
    source: Joi.string().optional(),
    assignedTo: Joi.string().uuid().optional(),
    score: Joi.number().min(0).max(100).optional(),
    estimatedValue: Joi.number().min(0).optional(),
    expectedCloseDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    notes: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const leadValidation = { create, update };