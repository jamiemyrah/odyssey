const { createConnection } = require('../utils/db-utils');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jamirah.nakkungu.upti@gmail.com',
    pass: 'liyyalyldwrdudcv'
    },
  tls: {
      rejectUnauthorized: false,
  }
});

async function sendVerification(email) {
    try {
        const mailOptions = {
            from: 'jamirah.nakkungu.upti@gmail.com',
            to: email,
            subject: "Set password to login",
            html: `<body>
        <h1>Create an account</h1>
        <a href="http://localhost:3000?email=${email}">
          <button style="background-color: #5F2781; border-radius: 10px; border: #5F2781; color: white; padding: 10px 20px; cursor: pointer;">Create Account</button>
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
      return jwt.sign(user, process.env.TOKEN_SECRET /*, { expiresIn: "36000s" }*/);
    }

const UsersController = {
    
    async login(request, response) {
        let connection = await createConnection();
        try {
          const { email, password } = request.body;
          const validate = `SELECT * FROM user WHERE email = ?`;
          const user = await connection.query(validate, [email]);
          if (user.length === 0) {
            return response.status(401).send({ error: 'Invalid username or password' });
          }
          
          const isPasswordValid = await bcrypt.compare(password, user[0].password);
          if (!isPasswordValid) {
            return response.status(401).send({ error: 'Invalid username or password' });
          }
      
          // Login successful
          // You can generate a token or perform other actions here
          return response.status(200).send({ message: 'Login successful' });
        } catch (error) {
          console.log(error);
          return response.status(500).send({ error });
        } finally {
          await connection.end();
        }
      },
      
    async setPassword(req, res, next) {
        let connection = await createConnection();
        try {
            await connection.connect();
          const email = req.body.email;
          const password = req.body.password;
          const hashedPassword = await bcrypt.hash(password, 6);
          console.log("email", email);
          const updatePasswordQuery =
            "UPDATE user SET PasswordHash = ? WHERE email = ?";
            await connection.query(updatePasswordQuery, [hashedPassword, email]);
          res.send({ message: "Password set successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).send({ error: error.message });
        }
      }, 
    
    async create(request, response){
        let connection = await createConnection();
        try{
            await connection.connect();
            const result = await connection.query(`INSERT INTO user (names,userLevel,company,email) VALUES(?,?,?,?)`, [
                request.body.names,
                request.body.userLevel,
                request.body.company,
                request.body.email
            ]);
            await sendVerification(email);
            if(result){
                return response.status(200).send({result});
            }
            return response.status(500).send({message: `UN EXPECTED ERROR OCCURRED`});
         
        } catch (error) {
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
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
          return response.status(500).send({ message: `UNEXPECTED ERROR OCCURRED` });
      
        } catch (error) {
          console.log(error);
          return response.status(500).send({ error });
        } finally {
          await connection.end();
        }
      },
      

    async updateById(request, response){
        let connection = await createConnection();
        const { id } = request.query;
        try{
            await connection.connect();
            let sql = `UPDATE user SET `;
            let keys = Object.keys(request.body);
            let counter = 0;
            for(let key of keys){
                counter++;
                sql += `${key} = ?`;
                if(counter < keys.length){
                    sql += `,`;
                }
            }
            sql += `WHERE user_id = ?`;
            const values = [];
            for(let key of keys){
                values.push(request.body[key]);
            }
            values.push(id);
            const result = await connection.query(sql, [...values]);
              
            if(result){
                return response.status(200).send({result});
            }
            return response.status(500).send({message: `UN EXPECTED ERROR OCCURRED`});
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },

    async deleteById(request, response) {
        let connection = await createConnection();
        const { id } = request.query;
        try {
          await connection.connect();
          const deleteResult = await connection.query(`DELETE FROM user WHERE user_id = ?`, [id]);
          if (deleteResult.affectedRows > 0) {
            return response.status(200).send("User deleted successfully");
          } else {
            return response.status(404).send("User not found");
          }
        } catch (error) {
          console.log(error);
          return response.status(500).send({ error });
        } finally {
          await connection.end();
        }
      },
    
    async findById(request, response){
        let connection = await createConnection();
        const {id} = request.query;
        try{
            await connection.connect();
            const fetchResult = await connection.query(`SELECT * FROM user WHERE user_id = ?`, [id]);
            return response.status(200).send(fetchResult[0][0]);
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },

    async findOne(request, response){
        let connection = await createConnection();
        try{
            await connection.connect();
            let sql = `SELECT * FROM user WHERE `;
            let keys = Object.keys(request.query);
            let counter = 0;
            for(let key of keys){
                counter++;
                sql += `${key} = ?`;
                if(counter < keys.length){
                    sql += ` AND `;
                }
            }

            sql += ` LIMIT 1 OFFSET 0`

            const values = [];
            for(let key of keys){
                values.push(request.query[key]);
            }
            const fetchResult = await connection.query(sql, [...values]);
            return response.status(200).send(fetchResult[0][0]);
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },

    async findAndCountAll(request, response){
        let connection = await createConnection();
        try{
            await connection.connect();
            let offset = 0;
            let limit = 100;
            if(request.query.offset){
                offset = +request.query.offset;
            }

            if(request.query.limit){
                limit = +request.query.limit;
            }
            const fetchResult = await connection.query(`SELECT * FROM user  LIMIT ${limit} OFFSET ${offset}`);
            const countResult = await connection.query(`SELECT COUNT('user_id') as count FROM user`);
            return response.status(200).send({ users: fetchResult[0] , count: countResult[0][0].count });
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },

    async deleteOne(request, response){
        let connection = await createConnection();
        try{
            await connection.connect();
            let sql = `DELETE FROM user WHERE user_id = ?`;
            let keys = Object.keys(request.query);
            let counter = 0;
            for(let key of keys){
                counter++;
                sql += `${key} = ?`;
                if(counter < keys.length){
                    sql += ` AND `;
                }
            }

            sql += ` LIMIT 1;`;
            const values = [];
            for(let key of keys){
                values.push(request.query[key]);
            }
            const result = await connection.query(sql, [...values]);
              
            if(result){
                return response.status(200).send({result});
            }
            return response.status(500).send({message: `UN EXPECTED ERROR OCCURRED`});
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },

    async update(request, response){
        let connection = await createConnection();
        try{
            await connection.connect();
            let sql = `UPDATE user SET `;
            let keys = Object.keys(request.body);
            let counter = 0;
            for(let key of keys){
                counter++;
                sql += `${key} = ?`;
                if(counter < keys.length){
                    sql += `,`;
                }
            }
            sql += `WHERE `;

            let queryKeys = Object.keys(request.query);
            let counter2 = 0;
            for(let key of queryKeys){
                counter2++;
                sql += `${key} = ?`;
                if(counter2 < queryKeys.length){
                    sql += ` AND `;
                }
            }

            const values = [];
            for(let key of keys){
                values.push(request.body[key]);
            }

            for(let key of queryKeys){
                values.push(request.query[key]);
            }
           
            const result = await connection.query(sql, [...values]);
              
            if(result){
                return response.status(200).send({result});
            }
            return response.status(500).send({message: `UN EXPECTED ERROR OCCURRED`});
        }catch(error){
            console.log(error);
            return response.status(500).send({error})
        }finally{
            await connection.end();
        }
    },


};
module.exports = UsersController;

