const mysql = require('mysql2');
const express = require('express');
const config = require('config');

const app = express.Router();

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};

// Create a connection pool
const pool = mysql.createPool(connectionDetails);

// GET all orders and order items by customer ID
app.get("/all/:cid", (req, res) => {
    const customerID = req.params.cid;

    const queryText = `
        SELECT 
            OrderDetails.OrderID,
            Products.ProductName,
            OrderDetails.Quantity
        FROM 
            OrderDetails
        INNER JOIN 
            Products ON Products.ProductID = OrderDetails.ProductID
        INNER JOIN 
            Orders ON Orders.OrderID = OrderDetails.OrderID
        WHERE 
            Orders.CustomerID = ?
    `;

    pool.query(queryText, [customerID], (err, result) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
        pool.end()
        res.end()
    });
});

// Add order item into order details table for a particular order
app.post("/addorderitem/:oid/:pid", (req, res) => {
    const orderID = req.params.oid;
    const productID = req.params.pid;
    const { Quantity, UnitPrice, Discount } = req.body;

    const queryText = `
        INSERT INTO OrderDetails (OrderID, ProductID, Quantity, UnitPrice, Discount)
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(queryText, [orderID, productID, Quantity, UnitPrice, Discount], (err, result) => {
        res.setHeader("Content-Type", "application/json");
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});
module.exports=app;