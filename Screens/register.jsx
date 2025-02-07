import { View,StyleSheet, ImageBackground,} from "react-native";
import { Button, Surface, Text, TextInput,Snackbar } from "react-native-paper";
import { useState } from "react";
import axios from 'axios';
import { getURL } from "../utils/constants";
function Register(props){

   

    const[credentials,setCredentials]=useState({ CustomerName:"", Email:"", Password:"", ContactName:"", Address:"", City:"", PostalCode:"", Country:"", Phone:"" });
    const baseURL=getURL();
    
    const [snackbarMessage,setSnackBarMessage]=useState("");
    const [snackBarVisible,setSnackBarVisible]=useState(false);

    const save=()=>{
        // const fullURL=`${baseURL}/customers/register`
    axios.post(`http://${baseURL}/customers/register`,credentials).then((result)=>{
        if(result.data){
            setSnackBarVisible(true);
            setSnackBarMessage("data saved");
            setTimeout(()=>{
                setSnackBarVisible(false)
             },2000)
          
           }else{
          setSnackBarVisible(true);
          setSnackBarMessage("data not saved");
          setTimeout(()=>{
            setSnackBarVisible(false)
         },2000)
           }
    })
      
    }

    const goBack=()=>{
        props.navigation.navigate("Sign-In")
    }

    
    
    return(
        <ImageBackground
        source={{ uri: 'https://w0.peakpx.com/wallpaper/239/976/HD-wallpaper-grocery-store.jpg' }} // Background image
        style={styles.background}
      >
    <View style={styles.container}>
          <Text style={styles.text}>Register</Text>
          <Surface style={styles.surface}>

          <TextInput style={styles.inputtext} label="Customer Name" placeholder="please enter your name" mode="outlined"
            value={credentials.CustomerName} onChangeText={(value)=>{
                setCredentials({...credentials,CustomerName:value})
            }}></TextInput>
            

            <TextInput style={styles.inputtext} label="Email" placeholder="please enter your email" mode="outlined"
            value={credentials.Email} onChangeText={(value)=>{
                setCredentials({...credentials,Email:value})
            }}></TextInput>


            <TextInput style={styles.inputtext} label="Password" placeholder="please enter your password" mode="outlined" 
                       value={credentials.Password} onChangeText={(value)=>{
                        setCredentials({...credentials,Password:value})
                       }}>   
            
            </TextInput>

            <TextInput style={styles.inputtext} label="Contact name" placeholder="please enter your contact name" mode="outlined"
            value={credentials.ContactName} onChangeText={(value)=>{
                setCredentials({...credentials,ContactName:value})
            }}></TextInput>

           <TextInput style={styles.inputtext} label="Address" placeholder="please enter your address" mode="outlined"
            value={credentials.Address} onChangeText={(value)=>{
                setCredentials({...credentials,Address:value})
            }}></TextInput>

<TextInput style={styles.inputtext} label="City" placeholder="please enter your city" mode="outlined"
            value={credentials.City} onChangeText={(value)=>{
                setCredentials({...credentials,City:value})
            }}></TextInput>

<TextInput style={styles.inputtext} label="postal code" placeholder="please enter your address" mode="outlined"
            value={credentials.PostalCode} onChangeText={(value)=>{
                setCredentials({...credentials,PostalCode:value})
            }}></TextInput>

<TextInput style={styles.inputtext} label="Country" placeholder="please enter your country" mode="outlined"
            value={credentials.Country} onChangeText={(value)=>{
                setCredentials({...credentials,Country:value})
            }}></TextInput>

<TextInput style={styles.inputtext} label="Phone" placeholder="please enter your phone number" mode="outlined"
            value={credentials.Phone} onChangeText={(value)=>{
                setCredentials({...credentials,Phone:value})
            }}></TextInput>
            <Button style={styles.button} mode="contained" labelStyle={{fontWeight:"bold",fontSize:20}} onPress={save}> save</Button>
            <Button style={styles.button} mode="contained" labelStyle={{fontWeight:"bold",fontSize:20}} onPress={goBack}>Go to login</Button>

          </Surface>
          <Snackbar
                visible={snackBarVisible}
                onDismiss={() => setSnackBarVisible(false)}
                duration={Snackbar.DURATION_SHORT}
            >
                {snackbarMessage}
            </Snackbar>
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
            paddingTop:50,
            fontSize:20, 
            fontWeight:'bold',
            color:'darkgray'
        },
        surface:{
           height:640,
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
            height:40
        },
        button:{
            margin:5,
            backgroundColor:"darkgray",
            width:200
        }
    }
)
export default Register;