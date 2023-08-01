const { createConnection } = require("../utils/db-utils");
const bcrypt = require("bcrypt"); // compares a hashed password agaist other passwords
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // generates the token sent to the user for login
require("crypto").randomBytes(64).toString("hex");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jamirah.nakkungu.upti@gmail.com",
    pass: "liyyalyldwrdudcv",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendVerification(email) {
  try {
    const mailOptions = {
      from: "jamirahnakkungu@gmail.com",
      to: email,
      subject: "Set password to login",
      html: `<body>
          <h1>Create an account</h1>
          <a href="http://localhost:3000?email=${email}">
            <button style="background-color: #1577; border-radius: 10px; border: #1577; color: white; padding: 10px 20px; cursor: pointer;">Create Account</button>
          </a>
        </body>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "36000s" });
}

const UsersController = {
  async login(request, response) {
    let connection;
    try {
      connection = await createConnection();
      const { email, password } = request.body;
      const validate = `SELECT * FROM user WHERE email = ?`;
      const [user] = await connection.query(validate, [email]);

      if (user.length === 0) {
        return response
          .status(401)
          .send({ error: "Invalid username or password" });
      }

      const hashedPassword = user[0].PasswordHash;

      // If the user has not set the password yet
      if (!hashedPassword) {
        return response.status(401).send({ error: "Password not set" });
      }

      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (!isPasswordValid) {
        return response
          .status(401)
          .send({ error: "Invalid username or password" });
      }

      const token = generateAccessToken(user[0]);

      // Login successful
      return response.status(200).send({
        token,
        email: user[0].email,
        user: user[0],
        message: "User logged in successfully",
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  },

  async setPassword(request, response, next) {
    let connection = await createConnection();
    try {
      await connection.connect();
      const email = request.body.email;
      const password = request.body.password;
      const hashedPassword = await bcrypt.hash(password, 6);
      console.log("hashedPassword", hashedPassword);
      console.log("password", password);

      const updatePasswordQuery =
        "UPDATE user SET PasswordHash = ? WHERE email = ?";
      await connection.query(updatePasswordQuery, [hashedPassword, email]);
      response.status(200).send({ message: "Password set successfully" });
    } catch (error) {
      //   console.error(hashedPassword);
      res.status(500).send({ error: error.message });
    }
  },

  async setUser(request, response, next) {
    let connection = await createConnection();
    try {
      await connection.connect();
      const email = request.body.email;
      const password = request.body.password;
      const hashedPassword = await bcrypt.hash(password, 6);
      console.log("hashedPassword", hashedPassword);
      console.log("password", password);

      const updatePasswordQuery =
        "UPDATE user SET PasswordHash = ? WHERE email = ?";
      await connection.query(updatePasswordQuery, [hashedPassword, email]);
      response.status(200).send({ message: "Password set successfully" });
    } catch (error) {
      //   console.error(hashedPassword);
      res.status(500).send({ error: error.message });
    }
  },

  async create(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      const result = await connection.query(
        `INSERT INTO user (names,userLevel,company,email) VALUES(?,?,?,?)`,
        [
          request.body.names,
          request.body.userLevel,
          request.body.company,
          request.body.email,
        ]
      );
      await sendVerification(request.body.email);
      if (result) {
        return response.status(200).send({ result });
      }

      return response
        .status(500)
        .send({ message: `UN EXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async logout(request, response) {
    try {
      request.session.destroy(); // Clear the session
      response.send({ message: "User logged out successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Failed to logout user", error: error.message });
    }
  },

  async update(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      const result = await connection.query(
        `ALTER TABLE user CHANGE Password PasswordHash FLOAT;`
      );
      if (result) {
        return response.status(200).send({ message: `changed successfully` });
      }
      return response
        .status(500)
        .send({ message: `UNEXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async updateById(request, response) {
    let connection = await createConnection();
    const { id } = request.query;
    try {
      await connection.connect();
      let sql = `UPDATE user SET `;
      let keys = Object.keys(request.body);
      let counter = 0;
      for (let key of keys) {
        counter++;
        sql += `${key} = ?`;
        if (counter < keys.length) {
          sql += `,`;
        }
      }
      sql += `WHERE user_id = ?`;
      const values = [];
      for (let key of keys) {
        values.push(request.body[key]);
      }
      values.push(id);
      const result = await connection.query(sql, [...values]);

      if (result) {
        return response.status(200).send({ result });
      }
      return response
        .status(500)
        .send({ message: `UN EXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async deleteById(request, response) {
    let connection = await createConnection();
    const { id } = request.query;
    try {
      await connection.connect();
      const result = await connection.query(
        `DELETE FROM user WHERE user_id = ?`,
        [id]
      );
      if (result) {
        return response.status(200).send({ result });
      }
      return response
        .status(500)
        .send({ message: `UN EXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async findById(request, response) {
    let connection = await createConnection();
    const { id } = request.query;
    try {
      await connection.connect();
      const fetchResult = await connection.query(
        `SELECT * FROM user WHERE user_id = ?`,
        [id]
      );
      return response.status(200).send(fetchResult[0][0]);
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async findOne(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      let sql = `SELECT * FROM user WHERE `;
      let keys = Object.keys(request.query);
      let counter = 0;
      for (let key of keys) {
        counter++;
        sql += `${key} = ?`;
        if (counter < keys.length) {
          sql += ` AND `;
        }
      }

      sql += ` LIMIT 1 OFFSET 0`;

      const values = [];
      for (let key of keys) {
        values.push(request.query[key]);
      }
      const fetchResult = await connection.query(sql, [...values]);
      return response.status(200).send(fetchResult[0][0]);
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async findAndCountAll(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      let offset = 0;
      let limit = 7;
      if (request.query.offset) {
        offset = +request.query.offset;
      }

      if (request.query.limit) {
        limit = +request.query.limit;
      }
      const fetchResult = await connection.query(
        `SELECT * FROM user  LIMIT ${limit} OFFSET ${offset}`
      );
      const countResult = await connection.query(
        `SELECT COUNT('user_id') as count FROM user`
      );
      return response
        .status(200)
        .send({ users: fetchResult[0], count: countResult[0][0].count });
    } catch (error) {
      console.log(users, error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  async deleteOne(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      let sql = `DELETE FROM user WHERE user_id = ? LIMIT 1;`;
      const values = [request.query.user_id]; // Assuming the query parameter is "user_id"

      const result = await connection.query(sql, values);

      if (result) {
        return response.status(200).send({ result });
      }
      return response
        .status(500)
        .send({ message: `UNEXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },

  //   let connection = await createConnection();
  //   try {
  //     await connection.connect();
  //     let sql = `DELETE FROM user WHERE user_id = ?`;
  //     let keys = Object.keys(request.query);
  //     let counter = 0;
  //     for (let key of keys) {
  //       counter++;
  //       sql += `${key} = ?`;
  //       if (counter < keys.length) {
  //         sql += ` AND `;
  //       }
  //     }

  //     sql += ` LIMIT 1;`;
  //     const values = [];
  //     for (let key of keys) {
  //       values.push(request.query[key]);
  //     }
  //     const result = await connection.query(sql, [...values]);

  //     if (result) {
  //       return response.status(200).send({ result });
  //     }
  //     return response
  //       .status(500)
  //       .send({ message: `UN EXPECTED ERROR OCCURRED` });
  //   } catch (error) {
  //     console.log(error);
  //     return response.status(500).send({ error });
  //   } finally {
  //     await connection.end();
  //   }
  // },
  async update(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      let sql = `UPDATE user SET `;
      let keys = Object.keys(request.body);
      let counter = 0;
      for (let key of keys) {
        counter++;
        sql += `${key} = ?`;
        if (counter < keys.length) {
          sql += `,`;
        }
      }
      sql += `WHERE `;

      let queryKeys = Object.keys(request.query);
      let counter2 = 0;
      for (let key of queryKeys) {
        counter2++;
        sql += `${key} = ?`;
        if (counter2 < queryKeys.length) {
          sql += ` AND `;
        }
      }

      const values = [];
      for (let key of keys) {
        values.push(request.body[key]);
      }

      for (let key of queryKeys) {
        values.push(request.query[key]);
      }

      const result = await connection.query(sql, [...values]);

      if (result) {
        return response.status(200).send({ result });
      }
      return response
        .status(500)
        .send({ message: `UN EXPECTED ERROR OCCURRED` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },
};
module.exports = UsersController;
