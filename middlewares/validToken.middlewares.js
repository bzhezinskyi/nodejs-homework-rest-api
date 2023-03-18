const jwt = require("jsonwebtoken");
const Users = require("../service/schemas/users.shemas");
const catchAsync = require("../utils/catchAsync");

const validToken = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await Users.findById(decodedToken);

  if (!currentUser) return res.status(401).json({ message: "Not authorized" });

  req.user = currentUser;

  next();
});

module.exports = { validToken };
