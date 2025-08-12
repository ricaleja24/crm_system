import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(400).json({
      message: 'Duplicate entry',
      field: error.errors[0]?.path
    });
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      message: 'Invalid reference',
      field: error.fields[0]
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};