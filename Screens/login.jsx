import { View,StyleSheet, ImageBackground,} from "react-native";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import axios from 'axios';
import userContext from "../context/userContext";
import { getURL } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
function Login(props){

    var userName=useContext(userContext);

    const[credentials,setCredentials]=useState({Email:"aman@gmail.com",Password:"aman123"});
    const baseURL=getURL();

    const login=()=>{
    console.log("login clicked")
    console.log(credentials)
    // const fullURL=`${baseURL}/customers/login`
    axios.post(`http://${baseURL}/customers/login`,credentials).then( async(result)=>{
        console.log(result)
        console.log(credentials)
        // debugger
          if(result.data !=null || result.data.jwttoken!=undefined){
          if(result.data){
            await AsyncStorage.setItem("token",result.data.jwttoken)
            await AsyncStorage.setItem("custID",result.data.custID.toString())
            await AsyncStorage.setItem("password",credentials.Password)
            await AsyncStorage.setItem("loggedInUser",credentials.Email)
            props.navigation.navigate("Menu")
          }else{
            Alert.alert('login failed')
          }
        }
    })
}

    const register=()=>{
        props.navigation.navigate("Register")
    }

    const [secureTextEntry,setSecureTextEntry]=useState(true);
    
    return(
        <ImageBackground
        source={{ uri: 'https://e0.pxfuel.com/wallpapers/850/378/desktop-wallpaper-grocery-store-groceries.jpg' }} // Background image
        style={styles.background}
      >
    <View style={styles.container}>
          <Text style={styles.text}>Welcome {userName}</Text>
          <Surface style={styles.surface}>

            <TextInput style={styles.inputtext} label="Email" placeholder="please enter your email" mode="outlined"
            value={credentials.Email} onChangeText={(value)=>{
                setCredentials({...credentials,Email:value})
            }}></TextInput>


            <TextInput style={styles.inputtext} label="Password" placeholder="please enter your password" mode="outlined"
                       secureTextEntry={secureTextEntry}  
                       right= {<TextInput.Icon icon={"eye"} 
                       onPress={()=>{
                                       setSecureTextEntry(!secureTextEntry)
                                    }
                               }/>
                           } 
                       value={credentials.Password} onChangeText={(value)=>{
                        setCredentials({...credentials,Password:value})
                       }}>   
            
            </TextInput>
            <Button style={styles.button} mode="contained" labelStyle={{fontWeight:"bold",fontSize:20}} onPress={login}> Login</Button>
            <Button style={styles.button} mode="contained" labelStyle={{fontWeight:"bold",fontSize:20}} onPress={register}>Register here</Button>
          </Surface>
    </View>
    
    </ImageBackground>
    
    )
    
}

var styles=StyleSheet.create(
    {
        container:{
            flex:1
        },
        background: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          },
        text:{
            textAlign:'center',
            paddingTop:90,
            fontSize:20, 
            fontWeight:'bold',
            color:'darkgray'
        },
        surface:{
           height:400,
           width:350, 
           justifyContent:'center',
           elevation:4,
           alignItems:'center',
           margin:20,
           borderRadius:30,
           backgroundColor:"rgba(0, 0, 0, 0.3)"
        },
        inputtext:{
            borderRadius:20,
            width:340,
            margin:5,
            height:60
        },
        button:{
            margin:10,
            backgroundColor:"darkgray",
            width:200
        }
    }
)
export default Login;