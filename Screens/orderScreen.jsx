import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { getURL } from "../utils/constants";
import axios from "axios";


function OrderScreen() {

    const [order,setOrder]=useState({ShipAddress:"", ShipCity:"", ShipPostalCode:"", ShipCountry:"" })
    
    
    const confirm=async()=>{
        const custID=parseInt(await AsyncStorage.getItem("custID"))
        const token=await AsyncStorage.getItem("token")
        const baseURL=getURL();

        axios.post(`http://${baseURL}/customers/orders/addorder/${custID}`,order,{headers:{Authorization:`${token}`}}).then((result)=>{
            if(result.data){
                
                props.navigation.navigate('Order Details')
            }else{
                console.log("error")
            }
        })
    }


    return ( <View style={styles.view}>
        <TextInput style={styles.textInput} label=" Address" mode="outlined"
        value={order.ShipAddress} onChangeText={(value)=>{
              setOrder({...order,ShipAddress:value})
        }}></TextInput>

        <TextInput style={styles.textInput} label=" city" mode="outlined" 
        value={order.ShipCity} onChangeText={(value)=>{
            setOrder({...order,ShipCity:value})
        }}></TextInput>

        <TextInput style={styles.textInput} label=" Postal code" mode="outlined"
         value={order.ShipPostalCode} onChangeText={(value)=>{
            setOrder({...order,ShipPostalCode:value})
        }}></TextInput>

        <TextInput style={styles.textInput} label="Country" mode="outlined"
         value={order.ShipCountry} onChangeText={(value)=>{
            setOrder({...order,ShipCountry:value})
        }}></TextInput>

        <Button style={styles.button} labelStyle={{fontSize:20,fontWeight:"bold"}} onPress={confirm}>Confirm</Button>
    </View> );
}
var styles=StyleSheet.create(
    {
        view:{
          flex:1,
          backgroundColor:'linen',
          justifyContent:'center',
          alignItems:"center"
        },
        textInput:{
            fontSize:20,
            height:50,
            width:300,
            backgroundColor:'offwhite',
            
        },
        button:{
            height:50,
            width:120,
            backgroundColor:'cyan',
            margin:20
        }
    }
)
export default OrderScreen;