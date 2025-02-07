import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Snackbar, Surface, Text } from "react-native-paper";
import { getURL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
function CartScreen(props) {

    const [cartItems,setCartItems]=useState([]);
    const [cartItem,setCartItem]=useState(
        {
            CustomerName:"",
            CartID:0,
            ProductName:"",
            UnitPrice:0.0,
            Quantity:0
        }
    )
    
    const baseURL=getURL()

    useEffect(()=>{

        const fetchCartItems=async()=>{ 
            const custID=await AsyncStorage.getItem("custID")
            const custIDInt=parseInt(custID)
             axios.get(`http://${baseURL}/customers/cartitems/get/all/${custIDInt}`,
                { headers : {Authorization : await AsyncStorage.getItem("token")}}
             ).then((result)=>{
               if(result.data != null){
                setCartItems(result.data)
                console.log(result.data)
                calculateTotal(result.data)
               }else{
                console.log("error")
               }
             })
             }
        fetchCartItems();
    })

    const [snackbarMessage,setSnackBarMessage]=useState("");
    const [snackBarVisible,setSnackBarVisible]=useState(false);

    const Delete=async(ci)=>{
        const ID=ci.CartItemID;
        const cartItemID=parseInt(ID)
       
        axios.delete(`http://${baseURL}/customers/cartitems/delete/single/${cartItemID}`,{headers:{Authorization:await AsyncStorage.getItem('token')}}).then(async(result)=>{
            if(result.data.affectedRows==1){
                setSnackBarVisible(true);
                setSnackBarMessage("Item deleted");
                 setTimeout(()=>{
                    setSnackBarVisible(false)
                 },2000)
                 console.log(result)
                //  await AsyncStorage.setItem("cartID",result.data.insertId.toString())
               }else{
              setSnackBarVisible(true);
              setSnackBarMessage("Item not deleted");
              setTimeout(()=>{
                setSnackBarVisible(false)
             },2000)
               }
        })
        
       
    }
    const order=()=>{
        props.navigation.navigate('Order Screen')
    }
    return ( <View style={styles.container}>
        <ScrollView>
             {
                cartItems.map((ci)=>{
                    return <View style={{flex:1,flexDirection:'column',justifyContent:"center"}}>
                        
                          <Surface style={styles.surface}>
                          <Text style={styles.text}> Name :{ci.CustomerName}</Text>
                          <Text style={styles.text}> Cart ID:{ci.CartID}</Text>
                          <Text style={styles.text}> Product Name:{ci.ProductName}</Text>
                          <Text style={styles.text}> Unit Price:{ci.UnitPrice}</Text>
                          <Text style={styles.text}> Quantity:{ci.Quantity}</Text>
                          <Text style={styles.text}> Total Price:{ci.Quantity * ci.UnitPrice}</Text>
                          <Text style={styles.text}> Cart Item ID:{ci.CartItemID}</Text>
                          <Button style={{margin:5, height:45,width:100,backgroundColor:'linen'}} labelStyle={{fontWeight:"bold",fontSize:15}} onPress={()=>Delete(ci)}> Delete</Button>
                          </Surface>
                        
                    </View>
                })
             }
                </ScrollView>
                <Snackbar
                visible={snackBarVisible}
                onDismiss={() => setSnackBarVisible(false)}
                duration={Snackbar.DURATION_SHORT}
            >
                {snackbarMessage}
            </Snackbar>

           <Button style={{margin:5, height:45,width:150,backgroundColor:'linen',marginLeft:120}} 
           labelStyle={{fontWeight:"bold",fontSize:15}}
           onPress={order}> Place Order</Button>
           
    </View> );
}
var styles=StyleSheet.create(
    {
       container:{
        flex:1,
        backgroundColor:'floralwhite',
        justifyContent:"space-between"
        
       },
       text:{
        fontSize:15,
        fontWeight:'bold'
       },
       surface: {
        height: 220,
        width: 350,
        justifyContent: "center",
        elevation: 5,
        alignItems: "center",
        margin: 20,
        borderRadius: 30,
        backgroundColor: "palegoldenrod",
      }
    }
)
export default CartScreen;






































































// import axios from "axios";
// import { useEffect, useState } from "react";
// import { StyleSheet, View ,Image, Alert} from "react-native";
// import { Surface, Text,Button } from "react-native-paper";
// import { getURL } from "../utils/constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// function CartScreen(props) {
//     const p=props.route.params.prod
//     // const quant=props.route.params.quantity
//     const [product,setProduct]=useState({productname:p.productname,price:p.price,categoryname:p.categoryname,image:p.image})
//     // const [quantity,setQuantity]=useState(0)
//     const baseURL=getURL();

//     useEffect(()=>{

//         const fetchSingleProduct=async()=>{ 
//             axios.get(`http://${baseURL}/customers/products/get/${props.route.params.prod.productid}`,{headers:{Authorization: await AsyncStorage.getItem("token") }}).then((result)=>{
//                 if(result.data!=null){
//                     setProduct(props.route.params.prod)
//                     // setQuantity(props.route.params.quantity)
//                 }else{
//                     Alert.alert("product not added")
//                 }
//             })
//             }
//          fetchSingleProduct()
//     },[props.route.params])
//      return (
//     <View style={{flex:1,justifyContent:"center",flexDirection:"column"}}>
//            <Surface style={styles.surface}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     margin: 5,
//                     padding: 10,
//                   }}
//                   key={product.productid}
//                 >
//                   <View>
//                     <Image
//                       source={{ uri: `http://${baseURL}/images/${product.image}` }}
//                       style={{ height: 190, width: 150, borderRadius: 30 }}
//                     ></Image>
//                   </View>
//                   <View
//                     style={{
//                       flexDirection: "column",
//                       justifyContent: "center",
//                       margin: 5,
//                       padding: 10,
//                       alignItems: "center",
//                     }}
//                   >
//                     <Text style={styles.text}>
//                       Product : {product.productname}
//                     </Text>
//                     <Text style={styles.text}>Price : {product.unitprice}</Text>
//                     <Text style={styles.text}>Category : {product.categoryname}</Text>
//                     <Button
//                       style={styles.button}
                      
//                       labelStyle={{
//                         fontWeight: "bold",
//                         fontStyle: "italic",
//                         fontSize: 20,
//                       }}
//                     >
//                       Added
//                     </Button>
//                   </View>
//                 </View>
//               </Surface>
//     </View>

//     // <View>
//     //     <Text>
//     //         {product.productname}
//     //     </Text>
//     // </View>
//      )
// }
// var styles=StyleSheet.create(
//     {
//         surface: {
//             height: 200,
//             width: 350,
//             justifyContent: "center",
//             elevation: 5,
//             alignItems: "center",
//             margin: 20,
//             borderRadius: 30,
//             backgroundColor: "palegoldenrod",
//           },
//           text: {
//             fontSize: 18,
//             fontWeight: "bold",
//             fontStyle: "italic",
//             color: "olivegreen",
//           },
//           button: {
//             margin: 5,
//             backgroundColor: "mintcream",
//             width: 150,
//             height: 40,
//           }
//     }
// )
// export default CartScreen;