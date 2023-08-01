const jwt = require("jsonwebtoken");
module.exports = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return response.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, users) => {
    console.log(err);
    if (err) return response.sendStatus(403);
    request.users = users;
    console.log("user", users);
    next();
  });
};
