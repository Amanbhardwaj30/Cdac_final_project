import axios from "axios";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { getURL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
function Profile(props){

    const [customers,setCustomers]=useState([]);

    const [customer,setCustomer]=useState({
        CustomerID:0,
        CustomerName:"",
        Email:"",
        Password:"",
        Country:"",
        Address:"",
        Phone:"",
        City:""
    })

    const baseURL=getURL();

    useEffect(()=>{
        const getCustomer=async()=>{
            const password=await AsyncStorage.getItem("password")
            const token = await AsyncStorage.getItem("token");
          axios.get(`http://${baseURL}/customers/products/profile/${password}`,{
            headers: {Authorization : token}
          }).then((result)=>{
            if(result.data!=null){
                console.log(result.data)
                setCustomers(result.data)
            }else{
                Alert.alert("customer not logged in")
            }
          })
        }
        getCustomer();
    },[])

    const backToMenu=()=>{
        props.navigation.navigate("Menu")
    }
    return(<ImageBackground source={{uri:'https://static.vecteezy.com/system/resources/previews/006/940/644/large_2x/supermarket-with-shelves-grocery-items-and-full-shopping-cart-retail-products-and-consumers-in-flat-cartoon-background-illustration-vector.jpg'}} style={{height:'100%',width:'100%'}}>
    <View style={styles.container1}>

           <Text style={{color:'purple',fontSize:20,fontWeight:"bold"}}>Your Account</Text>
            {
                customers.map((cust)=>{
                    return <View style={{flex:1,justifyContent:"space-around"}} key={cust.CustomerID}>
                        <Text style={styles.text}> ID: {cust.CustomerID}</Text>
                        <Text style={styles.text}> Name: {cust.CustomerName}</Text>
                        <Text style={styles.text}> Email: {cust.Email}</Text>
                        <Text style={styles.text}> Password: {cust.Password}</Text>
                        <Text style={styles.text}> Phone: {cust.Phone}</Text>
                        <Text style={styles.text}> City: {cust.City}</Text>
                        <Text style={styles.text}> Country: {cust.Country}</Text>
                        <Text style={styles.text}> Address: {cust.Address}</Text>
                        
                    </View>
                    
                })
            }

<Button onPress={backToMenu} style={styles.button}  labelStyle={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 20,
                      }}>  GO BACK</Button>
        
    </View>
    </ImageBackground>
    )
}

var styles=StyleSheet.create(
    {
        container1:{
            flex:1,
            justifyContent:'center',
            alignItems:"center",
            flexDirection:"column"
        },
        text:{
            fontSize: 18,
            fontWeight: "bold",
            fontStyle: "italic",
            color: "black",
        },
        button: {
            margin: 50,
            backgroundColor: "mintcream",
            width: 150,
            height: 40,
            
          }
    }
)
export default Profile;