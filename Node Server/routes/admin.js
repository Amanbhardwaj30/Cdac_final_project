const mysql=require('mysql2');
const express=require('express');
const config=require('config');
const jwt = require('jsonwebtoken');
// const app=express(); this provides a instance of express application
const app=express.Router(); //returns a mini app of express to use get post and other HTTP  methods and middlewares too

const connectionDetails={
    host:config.get("host"),
    database:config.get("database"),
    port:config.get("serverport"),
    user: config.get("user"),
    password: config.get("password")
}

//admin login
app.post("/login",(request,response)=>{
    const{Email,Password}=request.body;
    console.log(Email);
    console.log(Password);

    let queryText=`select * from admins where Email = '${Email}' and Password= '${Password}'`;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        response.setHeader("content-Type","application/json");
        if(err==null){
            if(result.length==0){
                response.write("user does not exist")
            }else{
                const {Email}=result[0].Email;
                const payload = {Email};
              
                const token = jwt.sign(payload, config.get("secretKey"));
                const jwttoken = {jwttoken:token}
                response.write(JSON.stringify(jwttoken));
            }
        }else{
            response.write(JSON.stringify(err));
        }
        connection.end();
        response.end();
    })
})

//admin register
app.post("/register", (request, response)=>
    {
    let AdminName = request.body.AdminName
    let Email = request.body.Email;
    let Password = request.body.Password;
    let Mobile = request.body.Mobile;


    let queryText = `insert into Admins(AdminName,Email, Password, Mobile) 
    values('${AdminName}', '${Email}', '${Password}', '${Mobile}');`;

    console.log(queryText);

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {

        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        }

        else {
            response.write(err);
        }
        connection.end();
        response.end();
    })

})

module.exports=app;


