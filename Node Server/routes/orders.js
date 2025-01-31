

const mysql = require('mysql2');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');

const app = express.Router();

// app.use(bodyParser.json());

const connectionDetails = {
    host: config.get("host"),
    database: config.get("database"),
    port: config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
};

app.get('/all/:cid',(request,response)=>{
    let customerid=request.params.cid;

    let queryText=`select * from orders where orders.customerid=${customerid}`;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        if(err==null){
            response.json(result)
        }else{
            response.json(err)
        }
        connection.end()
        response.end()
    })
})
//get last order of customer
app.get('/lastorder/:cid',(request,response)=>{
    let CustomerID = request.params.cid;

    let queryText = `SELECT * 
    FROM Orders
    WHERE CustomerID = ${CustomerID}
    ORDER BY OrderDate DESC,OrderId desc   
    LIMIT 1;`

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({ error: err }));
        }
        connection.end();
        response.end();
    });
})

// Place a new order without order items
app.post("/addorder/:cid", (request, response) => {

    let CustomerID = request.params.cid;
    let { ShipDate, ShipAddress, ShipCity, ShipPostalCode, ShipCountry } = request.body;

    let queryText = `INSERT INTO Orders(CustomerID, OrderDate, ShipDate, ShipAddress, ShipCity, ShipPostalCode, ShipCountry)
VALUES(${CustomerID}, NOW(), DATE_ADD(NOW(), INTERVAL 1 DAY), '${ShipAddress}', '${ShipCity}', '${ShipPostalCode}', '${ShipCountry}')
`;

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify(err));
        }
        connection.end();
        response.end();
    });
});
module.exports=app