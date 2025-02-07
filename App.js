import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/login";
import Menu from "./screens/menu"
import Register from "./screens/register";
import Profile from "./screens/profile";
import CartScreen from "./screens/cartScreen";
import ItemAdded from "./screens/itemAdded";
import OrderScreen from "./screens/orderScreen";
import OrderDetails from "./screens/orderdetails";
// import { Text } from "react-native-paper";
// import { StyleSheet } from "react-native";

function App(){
  var Stack=createNativeStackNavigator();

  return(<NavigationContainer>
     
   <Stack.Navigator>
   <Stack.Screen name='Sign-In' component={Login} options={{headerTitleAlign:'center',headerStyle:{
    backgroundColor:"yellowgreen"
  }}}></Stack.Screen>
    <Stack.Screen name='Menu' component={Menu} options={{headerTitleAlign:'center',headerStyle:{backgroundColor:"yellowgreen"}}}></Stack.Screen>
    <Stack.Screen name='Register' component={Register} options={{headerTitleAlign:'center',headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
    <Stack.Screen name='Profile' component={Profile} options={{headerTitleAlign:'center',headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
    <Stack.Screen name='Cart' component={CartScreen} options={{headerTitleAlign:'center',headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
    <Stack.Screen name='Added Item' component={ItemAdded} options={{headerTitleAlign:'center',headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
    <Stack.Screen name='Order Screen' component={OrderScreen} options={{headerTitleAlign:"center",headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
    <Stack.Screen name='Order Details' component={OrderDetails} options={{headerTitleAlign:"center",headerStyle:{backgroundColor:'yellowgreen'}}}></Stack.Screen>
   </Stack.Navigator>

  </NavigationContainer>)
}

export default App;
