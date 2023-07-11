const { createConnection } = require('../utils/db-utils')

const OrderItemController = {
  async create(request, response) {
    try {
      const connection = await createConnection(); // Create a database connection

      await connection.connect(); // Connect to the database

      const result = await connection.query(
        `INSERT INTO order_item (order_id, item_name, unit_price, quantity) VALUES (?, ?, ?, ?)`,
        [request.body.order_id, request.body.item_name, request.body.unit_price, request.body.quantity]
      );

      await connection.end(); // Close the database connection

      if (result) {
        return response.status(200).send({ result });
      }else{
        return response.status(500).send({ message: `UNEXPECTED ERROR OCCURRED` });

      }

    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
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

async deleteById(request, response){
    let connection = await createConnection();
    const { id } = request.query;
    try{
        await connection.connect();
        const result = await connection.query(`DELETE FROM user WHERE user_id = ?`, [id]);  
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

async delete(request, response){
    let connection = await createConnection();
    try{
        await connection.connect();
        let sql = `DELETE FROM user WHERE `;
        let keys = Object.keys(request.query);
        let counter = 0;
        for(let key of keys){
            counter++;
            sql += `${key} = ?`;
            if(counter < keys.length){
                sql += ` AND `;
            }
        }
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
        let sql = `DELETE FROM user WHERE `;
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

  // Rest of the methods...
};

module.exports = OrderItemController;



