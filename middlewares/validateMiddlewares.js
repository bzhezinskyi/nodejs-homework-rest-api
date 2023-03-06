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

// const schemaPut = Joi.object({
//   name: Joi.string().alphanum().min(3).max(30),
//   email: Joi.string().email({
//     minDomainSegments: 2,
//     tlds: { allow: ["com", "net"] },
//   }),
//   phone: Joi.string().min(3).max(15),
// });

exports.validatePost = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const validate = schemaPost.validate({ name, email, phone });
    if (!validate.error) return next();

    const error = new Error(validate.error);

    error.status = 400;

    next(error);
  } catch (error) {
    next(error);
  }
};
