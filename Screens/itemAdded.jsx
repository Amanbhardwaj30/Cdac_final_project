import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, View ,Image, Alert} from "react-native";
import { Surface, Text,Button } from "react-native-paper";
import { getURL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ItemAdded(props) {
    const p=props.route.params.prod
    // const quant=props.route.params.quantity
    const [product,setProduct]=useState({productname:p.productname,price:p.price,categoryname:p.categoryname,image:p.image})
    // const [quantity,setQuantity]=useState(0)
    const baseURL=getURL();

    useEffect(()=>{

        const fetchSingleProduct=async()=>{ 
            axios.get(`http://${baseURL}/customers/products/get/${props.route.params.prod.productid}`,{headers:{Authorization: await AsyncStorage.getItem("token") }}).then((result)=>{
                if(result.data!=null){
                    setProduct(props.route.params.prod)
                    // setQuantity(props.route.params.quantity)
                }else{
                    Alert.alert("product not added")
                }
            })
            }
         fetchSingleProduct()
    },[props.route.params])
     return (
    <View style={{flex:1,justifyContent:"center",flexDirection:"column"}}>
           <Surface style={styles.surface}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 10,
                  }}
                  key={product.productid}
                >
                  <View>
                    <Image
                      source={{ uri: `http://${baseURL}/images/${product.image}` }}
                      style={{ height: 190, width: 150, borderRadius: 30 }}
                    ></Image>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: 5,
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.text}>
                      Product : {product.productname}
                    </Text>
                    <Text style={styles.text}>Price : {product.unitprice}</Text>
                    <Text style={styles.text}>Category : {product.categoryname}</Text>
                    <Button
                      style={styles.button}
                      
                      labelStyle={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 20,
                      }}
                    >
                      Added
                    </Button>
                  </View>
                </View>
              </Surface>
    </View>

    // <View>
    //     <Text>
    //         {product.productname}
    //     </Text>
    // </View>
     )
}
var styles=StyleSheet.create(
    {
        surface: {
            height: 200,
            width: 350,
            justifyContent: "center",
            elevation: 5,
            alignItems: "center",
            margin: 20,
            borderRadius: 30,
            backgroundColor: "palegoldenrod",
          },
          text: {
            fontSize: 18,
            fontWeight: "bold",
            fontStyle: "italic",
            color: "olivegreen",
          },
          button: {
            margin: 5,
            backgroundColor: "mintcream",
            width: 150,
            height: 40,
          }
    }
)
export default ItemAdded;