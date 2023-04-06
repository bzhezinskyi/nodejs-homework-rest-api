const gravatar = require("gravatar");

module.exports = (email) =>
  gravatar.url(
    email,
    {
      s: "100",
      r: "g",
      d: "identicon",
    },
    false
  );
