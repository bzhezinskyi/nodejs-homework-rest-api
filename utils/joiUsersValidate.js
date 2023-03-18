const Joi = require("joi");

const joiUsersShema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(6)
    .max(30)
    .required(),
  subscription: Joi.string(),
});

module.exports = async (req, res, next) => {
  try {
    const { password, email, subscription } = req.body;

    const validate = joiUsersShema.validate({ password, email, subscription });
    if (validate.error)
      return res.status(400).json({ message: validate.error.message });

    next();
  } catch (error) {
    next(error);
  }
};
