const express = require("express");

const {
  registUsers,
  loginUsers,
  logoutUsers,
  currentUsers,
  updateSubscriptionStatusUser,
  changeUsersAvatar,
  chackVerifyUser,
  replayVerifyser,
} = require("../../controllers/users.controller");
const { uploadUserAvatar } = require("../../middlewares/users.middlewares");
const { validToken } = require("../../middlewares/validToken.middlewares");
const { joiUsersValidate } = require("../../utils");

//  /api/users
const usersRouter = express.Router();

usersRouter.route("/").all(validToken).patch(updateSubscriptionStatusUser);
usersRouter.route("/register").all(joiUsersValidate).post(registUsers);
usersRouter.route("/login").all(joiUsersValidate).post(loginUsers);
usersRouter.route("/logout").all(validToken).post(logoutUsers);
usersRouter.route("/current").all(validToken).post(currentUsers);
usersRouter
  .route("/avatar")
  .all(validToken)
  .patch(uploadUserAvatar, changeUsersAvatar);
usersRouter.route("/verify/:verificationToken").get(chackVerifyUser);
usersRouter.route("/verify").post(replayVerifyser);

module.exports = usersRouter;
