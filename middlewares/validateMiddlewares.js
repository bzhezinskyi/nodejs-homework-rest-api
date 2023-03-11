const Joi = require("joi");

const schemaPost = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string().min(3).max(15).required(),
});

const schemaPut = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string().min(3).max(15),
});

const validatePost = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const validate = schemaPost.validate({ name, email, phone });
    if (!validate.error) return next();

    const { message } = validate.error;
    const msg = message.slice(1, message.lastIndexOf('"'));

    res.status(400).json({ message: `missing required '${msg}' field` });
  } catch (error) {
    next(error);
  }
};

const validatePut = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "missing fields" });
    }

    const validate = schemaPut.validate({ name, email, phone });
    if (!validate.error) return next();

    res.status(404).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

module.exports = { validatePost, validatePut };
