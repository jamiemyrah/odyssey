const jwt = require("jsonwebtoken");
module.exports = async (request, response, next) => {
  try {
    if (request.user.userLevel === "Normal") {
      return response
        .status(403)
        .send("Users are not athourised to undertake this action");
    }
    next();
  } catch (error) {
    return response.status(500).send(error);
  }
};
