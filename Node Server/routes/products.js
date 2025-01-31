const mysql=require('mysql2');
const express=require('express');
const config=require('config');
const app=express.Router();
const path=require('path')
const multer=require('multer');

const connectionDetails={
    host:config.get("host"),
    database:config.get("database"),
    user:config.get("user"),
    password:config.get("password"),
    port:config.get("serverport")

}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})

const upload=multer({storage:storage});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/",(request,response)=>{
    let queryText=`select productname,categoryname,description,unitprice,image from products inner join categories on products.categoryid=categories.categoryid; `;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    
    connection.query(queryText,(err,result)=>{
        response.setHeader("content-type","application/json")
        if(err==null){
            const baseUrl = `${request.protocol}://${request.get('host')}/uploads/`;
            const products = result.map(product => ({
                ...product,
                ImageUrl: baseUrl + product.Image
            }));
            response.write(JSON.stringify(products))
        }else{
            response.write(JSON.stringify(err))
        }
        connection.end();
        response.end();
    })
})

app.post("/add",upload.single("Image"),(req,resp)=>{
    const {ProductName,UnitPrice,UnitsOnOrder,CategoryID}=req.body;
    const AdminID=1;
    const Image=req.file.filename;

    const queryText=`insert into products (ProductName,UnitPrice,UnitsOnOrder,CategoryID,AdminID,Image) values(?,?,?,?,?,?)`;

    const values= [ProductName,UnitPrice,UnitsOnOrder,CategoryID,AdminID,Image];

    const connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,values,(err,result)=>{
        if(err==null){
            resp.status(200).write(JSON.stringify(result))
        }else{
            resp.status(500).write(JSON.stringify(err))
        }
        connection.end();
        resp.end();
    })
})

app.delete("/delete/:id",(req,resp)=>{
    const id=req.params.id;
    let queryText=`delete from products where ProductId=${id}`;

    let connection=mysql.createConnection(connectionDetails);
    connection.connect();
    connection.query(queryText,(err,result)=>{
        if(err==null){
            resp.status(200).json(result)
        }else{
            resp.status(404).json(err)
        }
        connection.end();
        resp.end();
    })
})


// app.post("/add", upload.single('Image'), (request, response) => {
//     const { ProductName, CategoryID, UnitPrice, UnitsOnOrder } = request.body;
//     const AdminID=1;
//     const Image = request.file.filename; // Only the filename

//     const queryText = `INSERT INTO Products (ProductName, AdminID, CategoryID, UnitPrice, UnitsOnOrder, Image) 
//                        VALUES (?, ?, ?, ?, ?, ?)`;

//     const values = [ProductName, AdminID, CategoryID, UnitPrice, UnitsOnOrder, Image];

//     const connection = mysql.createConnection(connectionDetails);

//     connection.connect(err => {
//         if (err) {
//             return response.status(500).json({ error: 'Database connection failed', details: err });
//         }

//         connection.query(queryText, values, (err, result) => {
//             if (err) {
//                 return response.status(500).json({ error: 'Query failed', details: err });
//             }
//             response.status(200).json(result);
//             connection.end();
//         });
//     });
// });



module.exports=app;
