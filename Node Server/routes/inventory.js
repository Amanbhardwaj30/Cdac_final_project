const mysql=require('mysql2')
const express=require('express')
const config=require('config')
const app=express.Router()

const connectionDetails={
    host:config.get("host"),
    database:config.get("database"),
    user:config.get("user"),
    password:config.get("password"),
    port:config.get("serverport")

}

app.get("/",(req,resp)=>{
    // let queryText=`select * from inventory`;
    let queryText=` select inventoryid ,productname,quantity from inventory inner join products on inventory.productid=products.productid`;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        resp.setHeader("content-type","application/json")
        if(err==null){
            resp.write(JSON.stringify(result))
        }else{
            resp.json(err);
        }
        connection.end();
        resp.end();
    })
})

app.post("/add",(req,resp)=>{
    const{ProductID,Quantity}=req.body;

    let queryText=`INSERT INTO Inventory(ProductID, Quantity, LastUpdated) 
                     VALUES(?, ?, now());`;

    const values=[ProductID,Quantity];

    const connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,values,(err,result)=>{
        resp.setHeader("content-type","application/json")
        if(err==null){
            // resp.write(JSON.stringify(result))
            resp.status(200).json(result)
        }else{
            // resp.write(JSON.stringify(err))
            resp.status(401).json(err)
        }
        connection.end()
        resp.end();
    })
})

app.put("/update/:InventoryID",(req,resp)=>{
    let InventoryID = req.params.InventoryID;
    let { ProductID, Quantity, LastUpdated } = req.body;

    let queryText = `UPDATE Inventory SET ProductID = ${ProductID}, Quantity = ${Quantity},LastUpdated = '${LastUpdated}' WHERE InventoryID = ${InventoryID};`;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        resp.setHeader("content-type","application/json")
        if(err==null){
            resp.status(200).json(result)
        }else{
            resp.status(401).json(err)
        }
        connection.end();
        resp.end();
    })
})
module.exports=app;