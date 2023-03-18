const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Users = require("../service/schemas/users.shemas");
const catchAsync = require("../utils/catchAsync");

const registUsers = catchAsync(async (req, res) => {
  const dataUser = { ...req.body };

  await bcrypt.hash(dataUser.password, 10).then((hash) => {
    dataUser.password = hash;
  });

  if (await Users.findOne({ email: dataUser.email })) {
    return res.status(409).json({ message: "Email in use" });
  }
  const newUser = await Users.create(dataUser);

  res.status(201).json({
    user: { email: newUser.email, subscription: newUser.subscription },
  });
});

const loginUsers = catchAsync(async (req, res) => {
  const dataUser = { ...req.body };

  const user = await Users.findOne({ email: dataUser.email });

  if (!user || !(await bcrypt.compare(dataUser.password, user.password))) {
    return res.status(409).json({ message: "Email or password is wrong" });
  }

  const token = jwt.sign(user.id, process.env.JWT_SECRET || "secret");

  res.status(201).json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
});

const logoutUsers = catchAsync(async (req, res) => {
  res.status(204).json();
});

const currentUsers = catchAsync(async (req, res) => {
  res
    .status(200)
    .json({ email: req.user.email, subscription: req.user.subscription });
});

module.exports = { registUsers, loginUsers, logoutUsers, currentUsers };
