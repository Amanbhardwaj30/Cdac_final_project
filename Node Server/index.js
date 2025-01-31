const mysql=require('mysql2')
const express=require('express');
const cors=require('cors')
const jwt=require('jsonwebtoken')
const config=require('config')

const PORT=config.get("port");
const app=express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const adminRouteApp=require('./routes/admin')
const categoriesRoutesApp=require('./routes/categories')
const productsRoutesApp=require('./routes/products')
const inventoryRouteApp=require('./routes/inventory')
const customersRouteApp=require('./routes/customers')
const customersProductsRouteApp=require('./routes/customersProducts')
const cartRoutesApp=require('./routes/cart')
const cartItemsRoutesApp=require('./routes/cartitems')
const ordersRoutesApp=require('./routes/orders')
const orderDetailsRoutesApp=require('./routes/orderdetails')

app.use((request,response,next)=>{
   if(request.url.includes('/admin')){
      if(request.url.startsWith('/admin/register') || request.url.startsWith('/admin/login')){

          next();
      }else{
        const token= request.headers.authorization;
        if(!token || token.length==0){
            return response.status(401).send("token not found please log in");

        }try{
            const payload=jwt.verify(token,config.get('secretKey'))
            next();
        }catch(ex){
            return response.status(401).send("invalid token")
        }

      }
   }else if(request.url.includes('/customers')){
       if(request.url.startsWith('/customers/register') || request.url.startsWith('/customers/login')){
        next();
       }else{
        const token=request.headers.authorization;
        if(!token || token.length==0){
            return response.status(401).send("Token not found,please login again");
        }try{
           const payload = jwt.verify(token,config.get('secretkeycustomer'))
          
           next();
        }catch(ex){
            return response.status(401).send("Invalid Token");
        }
       }
   }
})
app.use('/customers',customersRouteApp)
app.use('/customers/products',customersProductsRouteApp)
app.use('/customers/cart',cartRoutesApp)
app.use('/customers/cartitems',cartItemsRoutesApp)
app.use('/customers/orders',ordersRoutesApp)
app.use('/customers/orderdetails',orderDetailsRoutesApp)


app.use("/admin",adminRouteApp);
app.use("/admin/categories",categoriesRoutesApp)
app.use("/admin/products",productsRoutesApp);
app.use("/admin/inventory",inventoryRouteApp)


app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}...`);
})

// const mysql=require('mysql2')
// const express=require('express')
// const config=require('config')
// const cors=require('cors')
// const jwt=require('jsonwebtoken')
// const PORT=config.get("port")
// const app=express();


// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))

// const adminRouteApp=require('./routes/admin')

// app.use((request,response,next)=>{
//     if(request.url.includes('/admin')){
//         if(request.url.startsWith('/admin/login') || request.url.startsWith('/admin/register')){
//             next();
//         }else{
//             const token=request.headers.authorization;
//             if(!token || token.length==0){
//                 return response.status(401).send("token not found")
//             }try{
//                 const payload=jwt.verify(token,config.get('secretKey'))
//                 next();
//             }catch(ex){
//                 response.status(401).send('invalid page')
//             }
//         }
//     }else{
//         if(request.url.includes('/customer')){
//             if(request.url.startsWith('/customer/register')||request.url.startsWith('/customer/login'))
//                 next();
//         }else{
//             const token=request.headers.authorization;
//             if(!token || token.length==0){
//                 return response.status(401).send('token not found')
//             }try{
//                 const payload=jwt.verify(token,config.get('secretKeyCustomer'))
//                 next()
//             }catch(ex){
//                 response.send('invalid page')
//             }
//         }
//     }
// })

// app.use('/admin',adminRouteApp)
// app.listen(PORT,()=>{
//     console.log(`server started at port ${PORT}....`)
// })

