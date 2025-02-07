import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { Searchbar, Surface, Text, Button, Snackbar } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import userContext from "../context/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getURL } from "../utils/constants";
function Menu(props) {
  var uName = useContext(userContext);
  const baseURL = getURL();
  const [userName, setUserName] = useState();
  AsyncStorage.getItem("loggedInUser").then((value) => {
    if (value) {
      setUserName(value);
    } else {
      setUserName(uName);
    }
  });

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    productname: "",
    unitprice: 0.0,
    categoryname:"",
    image: "",
    categoryid: 0,
  });

  useEffect(() => {
    const getProducts = async () => {
      const token = await AsyncStorage.getItem("token");
      axios
        .get(`http://${baseURL}/customers/products/get`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          if (result.data != null) {
            console.log(result.data);
            setProducts(result.data);
          } else {
            Alert.alert("Product not found");
          }
        });
    };
    getProducts();
  }, []);

  const profile = () => {
    props.navigation.navigate("Profile");
  };

  const [snackbarMessage,setSnackBarMessage]=useState("");
    const [snackBarVisible,setSnackBarVisible]=useState(false);

  const addCart = async() => {
    const custID=await AsyncStorage.getItem("custID")
    const custIDInt=parseInt(custID)
    console.log(custIDInt)
    axios.post(`http://${baseURL}/customers/cart/add`,{CustomerID:custIDInt},{headers:{Authorization:await AsyncStorage.getItem("token")}}).then(async(result)=>{
        
       if(result.data.affectedRows==1){
            setSnackBarVisible(true);
            setSnackBarMessage("cart added");
             setTimeout(()=>{
                setSnackBarVisible(false)
             },2000)
             console.log(result)
             await AsyncStorage.setItem("cartID",result.data.insertId.toString())
           }else{
          setSnackBarVisible(true);
          setSnackBarMessage("cart not added");
          setTimeout(()=>{
            setSnackBarVisible(false)
         },2000)
           }
       
    })

  };



  const [quantity,setQuantity]=useState(0);

  const quantityHandle=(type)=>{
     if(type==='add'){
        setQuantity(quantity + 1);
     }else if(type=== 'remove' && quantity > 1){
        setQuantity(quantity - 1);
     }
  }

  
  const addToCart=async(prod)=>{
    const cartID=await AsyncStorage.getItem("cartID")
    const cartIDInt=parseInt(cartID)
    console.log(cartIDInt)

    axios.post(`http://${baseURL}/customers/cartitems/add/${cartIDInt}/${prod.productid}`,{Quantity:quantity},{headers :{Authorization: await AsyncStorage.getItem("token")}}).then(async(result)=>{
        
        if(result.data.affectedRows==1){
            setSnackBarVisible(true);
            setSnackBarMessage("item added to cart successfully");
             setTimeout(()=>{
                setSnackBarVisible(false)
             },2000)
             console.log(result)
             await AsyncStorage.setItem("cartItemID",result.data.insertId.toString())
             props.navigation.navigate('Added Item',{prod})
           }else{
          setSnackBarVisible(true);
          setSnackBarMessage("Item not added to cart");
          setTimeout(()=>{
            setSnackBarVisible(false)
         },2000)
           }
        
    })
    //  props.navigation.navigate('Cart',{prod})
  }

  const cart=()=>{
    props.navigation.navigate("Cart")
  }
  return (
    <View style={styles.conatiner1}>
      <View style={styles.container2}>
        {/* <TouchableOpacity onPress={profile}>
             <Image source={{uri:'https://png.pngtree.com/png-clipart/20200224/original/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_5247852.jpg'}}
              style={{height:50,width:60}}
              ></Image>
             </TouchableOpacity> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="person" size={35} onPress={profile}></Icon>
          <Text style={styles.text}>      welcome : {userName}      </Text>
         
          <View style={styles.cartIconContainer}>
          <Icon name="shopping-cart" size={35} onPress={cart}></Icon>
          {/* {
          products.map((prod) => {
               return (
            <View key={prod.productid}>
             <Icon 
               name="shopping-cart" 
              size={35} 
               onPress={() => cart(prod)} 
               />
            </View>
             );
            })} */}
         {quantity > 0 && ( <View style={styles.cartBadge}> 
            <Text style={styles.cartBadgeText}>
                {quantity}</Text> 
                </View> )}
                </View>
        </View>
        <View style={styles.searchContainer}>
          <Searchbar
            style={{
              height: 50,
              width: 380,
              marginLeft: 5,
              backgroundColor: "white",
            }}
            placeholder="search products..."
          ></Searchbar>
        </View>
      </View>
      <View style={styles.container3}>
        <ImageBackground
          source={{
            uri: "https://www.appslure.com/wp-content/uploads/2023/10/Explore-the-Ultimate-Food-and-Grocery-Delivery-App-for-Seamless-Shopping.png",
          }}
          style={{ height: 190, width: 380, marginLeft: 8 }}
        ></ImageBackground>
        <View style={{flexDirection:'row'}}>
        <Text
          style={{
            fontStyle: "italic",
            fontWeight: "bold",
            color: "olivegreen",
            fontSize: 18,
            margin:10
          }}
        >
          Add your Cart first to shop
        </Text>
        <Button style={styles.button2} onPress={addCart}  labelStyle={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 20,
                      }}>ADD CART</Button>
        </View>
        <ScrollView>
          {products.map((prod) => {
            return (
              <Surface style={styles.surface}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: 5,
                    padding: 10,
                  }}
                  key={prod.productid}
                >
                  <View>
                    <Image
                      source={{ uri: `http://${baseURL}/images/${prod.image}` }}
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
                      Product : {prod.productname}
                    </Text>
                    <Text style={styles.text}>Price : {prod.unitprice}</Text>
                    <Text style={styles.text}>Category : {prod.categoryname}</Text>
                    
                    <Button
                      style={styles.button}
                      onPress={()=>addToCart(prod)}
                      labelStyle={{
                        fontWeight: "bold",
                        fontStyle: "italic",
                        fontSize: 20,
                      }}
                    >
                      ADD TO CART
                    </Button>
                   <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    
                    <Icon name="remove" size={30} onPress={()=>quantityHandle('remove')}></Icon>
                    <Text>         </Text>
                    <Icon name="add" size={30} onPress={()=>quantityHandle('add')}></Icon>
                   </View>
                  </View>
                </View>
              </Surface>
            );
          })}
        </ScrollView>
        
      </View>
       <Snackbar
                visible={snackBarVisible}
                onDismiss={() => setSnackBarVisible(false)}
                duration={Snackbar.DURATION_SHORT}
            >
                {snackbarMessage}
            </Snackbar>
    </View>
  );
}

var styles = StyleSheet.create({
  conatiner1: {
    flex: 1,
    // justifyContent:'center',
    // alignItems:'center'
  },
  container2: {
    //    flexDirection:"row",
    //    alignItems:'center',
    backgroundColor: "lightgray",
  },
  container3: {
    flex: 1,
    backgroundColor: "floralwhite",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "olivegreen",
  },
  searchContainer: {
    flexDirection: "column",
    marginTop: 5,
  },
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
  button: {
    margin: 5,
    backgroundColor: "mintcream",
    width: 150,
    height: 40,
  },
  button2: {
    margin: 5,
    backgroundColor: "orange",
    width: 150,
    height: 40,
  },
  button3: {
    margin: 5,
    backgroundColor: "orange",
    width: 30,
    height: 40,
  },
  cartIconContainer: {
    position: 'relative'
   },
   cartBadge: {
        position: 'absolute',
        right: -10,
         top: 5, 
         backgroundColor: 'red',
          borderRadius: 10, 
          width: 20, 
          height: 20, 
          justifyContent: 'center', 
          alignItems: 'center', 
       }, 
       cartBadgeText: { 
           color: '#fff', 
           fontSize: 12, 
           fontWeight: 'bold'
       }
});
export default Menu;
