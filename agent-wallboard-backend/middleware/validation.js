const Joi = require('joi');

const messageSchema = Joi.object({
  from: Joi.string().trim().min(1).max(50).required(),
  to: Joi.string().trim().max(50).allow(null),
  content: Joi.string().trim().min(1).max(500).required(),
  priority: Joi.string().valid('low', 'normal', 'high'),
});

/** Validate req.body against a Joi schema and return 400 with every problem found. */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map((d) => d.message),
      });
    }
    req.body = value;
    next();
  };
}

module.exports = { validate, messageSchema };
