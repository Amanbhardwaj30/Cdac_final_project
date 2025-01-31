const mysql=require('mysql2')
const express=require('express')
// const jwt=require('jsonwebtoken')
const config=require('config')
const path=require('path')
const fs=require('fs')
const app=express.Router()

const connectionDetails={
       host:config.get("host"),
       database:config.get("database"),
       user:config.get("user"),
       password:config.get("password"),
       port:config.get("serverport")
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get("/get",(request,response)=>{
    let queryText=`select products.productid,productname,categoryname,unitprice,image from products inner join categories on
                   products.categoryid=categories.categoryid inner join inventory on products.productid=inventory.productid
                   where inventory.productid is not null and inventory.quantity>0`;

    let connectionn=mysql.createConnection(connectionDetails)
    connectionn.connect();
    connectionn.query(queryText,(err,result)=>{
        response.setHeader("content-type","application/json")
        if(err==null){
            const baseUrl = `${request.protocol}://${request.get('host')}/uploads/`;
            const products = result.map(product => ({
                ...product,
                ImageUrl: baseUrl + product.Image
            }));
           response.status(200).json(products)
        }else{
            response.status(404).json(err)
        }
        connectionn.end();
        response.end();
    })
})

app.put("/update/:ProductID", (request, response) => {
    let ProductID = request.params.ProductID;
    //let { ProductID, Quantity, LastUpdated } = request.body;

    let queryText = `UPDATE Inventory SET  Quantity = Quantity - 1 
     WHERE ProductID = ${ProductID};`;

    let connection = mysql.createConnection(connectionDetails);
    connection.query(queryText, (err, result) => {
        response.setHeader("content-Type", "application/json");
        if (err == null) {
            response.write(JSON.stringify(result));
        } else {
            response.write(JSON.stringify({error: err}));
        }
        connection.end();
        response.end();
    });
});


app.get("/image/:productId", (request, response) => {
    const productId = request.params.productId;

    const queryText = `
        SELECT Image 
        FROM Products  
        WHERE ProductID = ?
    `;

    const connection = mysql.createConnection(connectionDetails);

    connection.connect(err => {
        if (err) {
            return response.status(500).json({ error: 'Database connection failed', details: err });
        }

        connection.query(queryText, [productId], (err, result) => {
            if (err) {
                return response.status(500).json({ error: 'Query failed', details: err });
            }

            if (result.length === 0 || !result[0].Image) {
                return response.status(404).json({ error: 'Image not found' });
            }

            const imagePath = path.join(__dirname, '../uploads', result[0].Image);
            console.log(imagePath);

            if (fs.existsSync(imagePath)) {
                const imageStream = fs.createReadStream(imagePath);
                response.setHeader('Content-Type', 'image/jpeg');
                imageStream.pipe(response);
            } else {
                response.status(404).json({ error: 'Image file not found' });
            }

            connection.end();
        });
    });
});
module.exports=app;