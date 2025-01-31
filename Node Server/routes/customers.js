const mysql=require('mysql2')
const express=require('express')
const jwt=require('jsonwebtoken')
const config=require('config')
// const path=require('path')
const app=express.Router()

const connectionDetails={
       host:config.get("host"),
       database:config.get("database"),
       user:config.get("user"),
       password:config.get("password"),
       port:config.get("serverport")
}

app.post("/login",(request,response)=>{
    const{Email,Password}=request.body;

    let queryText=`select * from customers where Email='${Email}' and Password='${Password}';`
    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        response.setHeader("content-type","application/json")
        if(err==null){
            if(result.length==0){
                response.status(404).json("user not found")
            }else{
                const payload={Password}
                const token=jwt.sign(payload,config.get('secretkeycustomer'))
                const jwttoken={jwttoken:token}
                response.status(200).json(jwttoken)
                // response.write(JSON.stringify(jwttoken))
            }
        }else{
            response.status(404).json(err)
        }
        connection.end()
        response.end();
    })
})

app.post("/register",(request,response)=>{
    const { CustomerName, Email, Password, ContactName, Address, City, PostalCode, Country, Phone } = request.body;

    let queryText=`insert into customers(CustomerName, Email, Password, ContactName, Address, City, PostalCode, Country, Phone) values(?,?,?,?,?,?,?,?,?)`

    const values=[CustomerName, Email, Password, ContactName, Address, City, PostalCode, Country, Phone]

    const connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,values,(err,result)=>{
        response.setHeader("content-type","application/json")
        if(err==null){
            response.write(JSON.stringify(result))
        }else{
            response.write(JSON.stringify(err))
        }
        connection.end()
        response.end();
    })
})


module.exports=app;