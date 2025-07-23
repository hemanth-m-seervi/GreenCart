import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";


axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContextProvider = ({ children }) => {

  const currency =  import.meta.env.VITE_CURRENCY ;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery,setSearchQuery] = useState({})


  const fetchSeller = async () => {
    try {
      const {data} = await axios.get("/api/seller/is-auth");
      if(data.success){
        setIsSeller(true)
      }else{
        setIsSeller(false)
      }
    } catch (error) {
      setIsSeller(false)
    }
  }


  const fetchUser = async () => {
    try {
      const {data} = await axios.get("/api/user/is-auth");
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      setUser(null)
    }
  }


  const fetchProducts = async () => {
    try {
      const {data} = await axios.get("/api/product/list")
      if(data.success){
        setProducts(data.products)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addToCart = (productId) => {
  setCartItems(prev => ({
    ...prev,
    [productId]: prev[productId] ? prev[productId] + 1 : 1
  }));
  toast.success("Item added to cart");
};

  const updateCartItem = (itemid, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemid]= quantity;
    setCartItems(cartData);
    toast.success("Cart updated successfully");
  }

  const removeFromCart = (itemid) => {
    let cartData = structuredClone(cartItems);
    if(cartData[itemid]){
      cartData[itemid]-= 1;
      if(cartData[itemid] === 0){
        delete cartData[itemid];
      }
    } 
    setCartItems(cartData);
      toast.success("Item removed from cart");
  }

  const getCartCount=()=>{
    let totalCount=0;
    for(const item in cartItems){
      totalCount+=cartItems[item];
    }
    return totalCount;
  }

  const getCartAmount=()=>{
    let totalAmount=0;
    for(const items in cartItems){
      let itemInfo = products.find((product)=>product._id ===items)
      if(cartItems[items]>0){
        totalAmount += itemInfo.offerPrice * cartItems[items] 
      }
    }
    return Math.floor(totalAmount * 100)/100;
  }

  useEffect(() => {
    fetchProducts()
    fetchSeller()
    fetchUser()
}, [])

 useEffect(()=>{
  const updateCart = async () => {
    try {
      const {data} = await axios.post("/api/cart/update",{userId:user._id, cartItems})
      if(!data.success){
        toast.error(data.message)
      }
      } catch (error) {
      toast.error(error.message)
    }
  } 
  if(user){
    updateCart()
  }
 },[cartItems,user])



  const value = { navigate, user, setUser, isSeller, setIsSeller ,showUserLogin, setShowUserLogin ,products, currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts,fetchUser,setCartItems};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
