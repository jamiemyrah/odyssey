const { createConnection } = require("../utils/db-utils");

const OrderController = {
  async create(request, response) {
    try {
      let connection = await createConnection();

      try {
        await connection.connect();
        let totalCost = 0;

        if (!Array.isArray(request.body.orderItems)) {
          return response
            .status(400)
            .send({ error: "orderItems must be an array" });
        }

        for (let one of request.body.orderItems) {
          totalCost += one.unitPrice * one.quantity;
        }
        const result = await connection.query(
          `INSERT INTO orders (user_id, debt) VALUES(?, ?)`,
          [request.body.user_id, totalCost > 2000 ? totalCost - 2000 : null]
        );

        if (result) {
          const orderId = result[0].insertId;

          for (let one of request.body.orderItems) {
            await connection.query(
              `INSERT INTO order_item (order_id,item_name,unit_price,quantity) VALUES(?,?,?,?)`,
              [orderId, one.itemName, one.unitPrice, one.quantity]
            );
          }
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
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async updateById(request, response) {
    try {
      return response.status(200).send({ message: `request received` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async deleteById(request, response) {
    const { order_id } = request.query;

    let connection = await createConnection();
    try {
      await connection.connect();

      // Implement the SQL query to delete the order by order_id
      const result = await connection.query(
        `DELETE FROM orders WHERE order_id = ?`,
        [order_id]
      );

      if (result) {
        return response
          .status(200)
          .send({ message: `Order deleted successfully` });
      } else if (!result) {
        return response
          .status(200)
          .send({ message: `Order deleted successfully` });
      } else {
        return response.status(404).send({ message: `Order not found` });
      }
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async delete(request, response) {
    try {
      return response.status(200).send({ message: `request received` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async findOne(request, response) {
    try {
      return response.status(200).send({ message: `request received` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async findById(request, response) {
    let connection = await createConnection();
    try {
      await connection.connect();
      let offset = 0;
      let limit = 100;
      if (request.query.offset) {
        offset = +request.query.offset;
      }

      if (request.query.limit) {
        limit = +request.query.limit;
      }

      let sql = `SELECT orders.*, user.user_id , order_item.order_item_id, order_item.order_id AS referenced_id, order_item.item_name, order_item.unit_price, order_item.quantity FROM orders 
            LEFT JOIN order_item ON orders.order_id = order_item.order_id 
            INNER JOIN user ON orders.user_id = user.user_id 
            LIMIT ${limit} OFFSET ${offset}`;
      const ordersMap = {};
      const fetchResult = await connection.query(sql, []);
      if (Array.isArray(fetchResult[0]) && fetchResult[0].length) {
        let count = 0;
        for (let one of fetchResult[0]) {
          if (!ordersMap[`${one.order_id}`]) {
            ordersMap[`${one.order_id}`] = {
              order_id: one.order_id,
              user_id: one.user_id,
              order_date: one.order_date,
              debt: one.debt,
              user: {
                names: one.names,
                user_id: one.user_id,
              },
              order_items: [],
            };
          }

          if (one.order_item_id) {
            ordersMap[`${one.order_id}`].order_items.push({
              order_item_id: one.order_item_id,
              item_name: one.item_name,
              unit_price: one.unit_price,
              quantity: one.quantity,
            });
          }
        }
      }
      const countResult = await connection.query(
        `SELECT COUNT('order_id') as count FROM orders`
      );
      return response.status(200).send({
        orders: Object.values(ordersMap),
        count: countResult[0][0].count,
      });
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
      let limit = 100;
      if (request.query.offset) {
        offset = +request.query.offset;
      }

      if (request.query.limit) {
        limit = +request.query.limit;
      }

      let sql = `SELECT orders.*, user.*, order_item.order_item_id, order_item.order_id AS referenced_id, order_item.item_name, order_item.unit_price, order_item.quantity FROM orders 
            LEFT JOIN order_item ON orders.order_id = order_item.order_id 
            INNER JOIN user ON orders.user_id = user.user_id 
            LIMIT ${limit} OFFSET ${offset}`;
      const ordersMap = {};
      const fetchResult = await connection.query(sql, []);
      if (Array.isArray(fetchResult[0]) && fetchResult[0].length) {
        let count = 0;
        for (let one of fetchResult[0]) {
          if (!ordersMap[`${one.order_id}`]) {
            ordersMap[`${one.order_id}`] = {
              order_id: one.order_id,
              user_id: one.user_id,
              order_date: one.order_date,
              debt: one.debt,
              user: {
                names: one.names,
                user_id: one.user_id,
              },
              order_items: [],
            };
          }

          if (one.order_item_id) {
            ordersMap[`${one.order_id}`].order_items.push({
              order_item_id: one.order_item_id,
              item_name: one.item_name,
              unit_price: one.unit_price,
              quantity: one.quantity,
            });
          }
        }
      }
      const countResult = await connection.query(
        `SELECT COUNT('order_id') as count FROM orders`
      );
      return response.status(200).send({
        orders: Object.values(ordersMap),
        count: countResult[0][0].count,
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    } finally {
      await connection.end();
    }
  },
  async deleteOne(request, response) {
    try {
      return response.status(200).send({ message: `request received` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },

  async update(request, response) {
    try {
      return response.status(200).send({ message: `request received` });
    } catch (error) {
      console.log(error);
      return response.status(500).send({ error });
    }
  },
};
module.exports = OrderController;
