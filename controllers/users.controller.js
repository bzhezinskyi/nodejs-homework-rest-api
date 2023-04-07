const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const Users = require("../service/schemas/users.shemas");
const { createAvatarByEmail, catchAsync } = require("../utils");
const UserAvatarService = require("../service/users.service");
const Email = require("../service/email.service");

//  POST /api/users/register
const registUsers = catchAsync(async (req, res) => {
  if (await Users.findOne({ email: req.body.email })) {
    return res.status(409).json({ message: "Email in use" });
  }

  const avatarURL = createAvatarByEmail(req.body.email);
  const verificationToken = uuid();

  const dataUser = { ...req.body, avatarURL, verificationToken };

  await bcrypt.hash(dataUser.password, 10).then((hash) => {
    dataUser.password = hash;
  });

  const newUser = await Users.create(dataUser);

  try {
    await new Email(
      newUser,
      `localhost:${process.env.PORT}/api/users/verify/${verificationToken}`
    ).sendRegister();
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

//  POST /api/users/login
const loginUsers = catchAsync(async (req, res) => {
  const dataUser = { ...req.body };

  const user = await Users.findOne({ email: dataUser.email });

  if (!user || !(await bcrypt.compare(dataUser.password, user.password))) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!user.verify) {
    return res.status(404).json({ message: "User not verification" });
  }

  const token = jwt.sign(user.id, process.env.JWT_SECRET || "secret");

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

//  POST /api/users/logout
const logoutUsers = catchAsync(async (req, res) => {
  res.status(204).json();
});

//  POST /api/users/current
const currentUsers = catchAsync(async (req, res) => {
  res
    .status(200)
    .json({ email: req.user.email, subscription: req.user.subscription });
});

//  PATCH /api/users
const updateSubscriptionStatusUser = catchAsync(async (req, res) => {
  const { subscription } = req.body;
  const { user } = req;

  if (
    subscription !== "starter" &&
    subscription !== "pro" &&
    subscription !== "business"
  ) {
    return res.status(400).json({
      message: `Invalid value subscription - '${subscription}'. The subscript must have one of the following values: 'starter', 'pro', 'business'`,
    });
  }
  if (subscription === user.subscription)
    return res
      .status(400)
      .json({ message: `User subscription - '${subscription}'` });

  const updateUser = await Users.findByIdAndUpdate(user._id, {
    subscription: subscription,
  });

  updateUser.subscription = subscription;
  res.status(200).json(updateUser);
});

//  PATCH /api/users/avatar
const changeUsersAvatar = catchAsync(async (req, res) => {
  const { user, file } = req;
  if (!file) return res.status(401).json({ message: "Not authorized" });

  const avatarURL = await UserAvatarService.save(user._id, file);

  await Users.findByIdAndUpdate(user._id, {
    avatarURL,
  });

  res.status(200).json({ avatarURL });
});

// GET /api/users/verify/:verificationToken
const chackVerifyUser = catchAsync(async (req, res) => {
  const user = await Users.findOne({
    verificationToken: req.params.verificationToken,
  });

  if (!user || user.verify) {
    return res.status(404).json({ message: "User not found" });
  }

  user.verificationToken = null;
  user.verify = true;

  await user.save();

  res.status(200).json({ message: "Verification successful" });
});

// POST /api/users/verify
const replayVerifyser = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await Users.findOne({ email: email });

  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  user.verificationToken = uuid();

  await user.save();

  try {
    await new Email(
      user,
      `localhost:${process.env.PORT}/api/users/verify/${user.verificationToken}`
    ).sendRegister();
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({ message: "Verification has already been passed" });
});

module.exports = {
  registUsers,
  loginUsers,
  logoutUsers,
  currentUsers,
  updateSubscriptionStatusUser,
  changeUsersAvatar,
  chackVerifyUser,
  replayVerifyser,
};
