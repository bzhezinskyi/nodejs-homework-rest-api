const express = require("express");

const {
  registUsers,
  loginUsers,
  logoutUsers,
  currentUsers,
} = require("../../controllers/users.controller");
const { validToken } = require("../../middlewares/validToken.middlewares");
const { joiUsersValidate } = require("../../utils");

const router = express.Router();

router.route("/register").all(joiUsersValidate).post(registUsers);
router.route("/login").all(joiUsersValidate).post(loginUsers);
router.route("/logout").all(validToken).post(logoutUsers);
router.route("/current").all(validToken).post(currentUsers);

module.exports = router;
