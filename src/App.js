
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import { Route, Routes } from 'react-router-dom';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import Login from './components/ContentComponent/users/Login';
import { Grid } from '@mui/material';

import {useState, useEffect} from 'react';
import {auth} from './firebase'
import ProductDetail from './components/ContentComponent/products/ProductDetail';
import ShoppingCart from './components/ContentComponent/orders/ShoppingCart';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/ContentComponent/users/Profile';
import MyOrders from './components/ContentComponent/users/MyOrders';
import SignUp from './components/ContentComponent/users/SignUp';
import ProductTable from './components/ContentComponent/products/ProductTable';
import CustomerTable from './components/ContentComponent/users/CustomerTable';
import OrderTable from './components/ContentComponent/orders/OrderTable';
import AllProducts from './components/ContentComponent/products/AllProducts';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const siteKey = '6LcwaaYfAAAAAHvrsRmTJGiaIr7fLQMZcJgpt2ct';

  const cartHandle = (data) => {
    let selectedProduct = data;
    let copy = [...cart];
    if (copy.length === 0) { // cart empty 
      copy.push(selectedProduct);
      //localStorage.setItem('cart', JSON.stringify(cart));
    }
    else {
      let check = false; // new item to cart    
      copy.map((item, index) => {
          if (item.productId === selectedProduct.productId) {
            check = true;
            copy[index].quantity = copy[index].quantity + 1;
          }
          return copy;
      })
      if (!check) {
        copy.push(selectedProduct);
        //localStorage.setItem('cart', JSON.stringify(cart));
      }
    }  
    localStorage.setItem('cart', JSON.stringify(copy));  
    setCart(copy);    
  }

  useEffect(() => {
    console.log("App user: ", user);     
    console.log(cart);    
    
    if(cart.length===0 && user) {
      let temp = localStorage.getItem('cart');
      if (temp.length>0) setCart(JSON.parse(temp));
    }
    auth.onAuthStateChanged((result) => {
      setUser(result);
    });   
  },[user, cart]);  

  return (
    <div >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12} mb={5}>
          <HeaderComponent currentUser={user} numCart={cart}/>    
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} mt={10}>
            <Routes>
              <Route path='/login' element={
                <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
                  <Login sendUser={setUser}/>
                </GoogleReCaptchaProvider>
                }
              />
              <Route path='/' element={<HomepageContent/>}/>
              <Route path='*' element={<HomepageContent/>}/>
              <Route path='products/:id' element={<ProductDetail currentUser={user} sendProduct={cartHandle}/>}/>
              <Route path='shoppingcart' element={<ShoppingCart currentCart={cart} currentUser={user}/>}/>
              <Route path='profile' element={<Profile/>}/>
              <Route path='orders' element={<MyOrders/>}/>
              <Route path='signup' element={
                  <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
                    <SignUp/>
                  </GoogleReCaptchaProvider>
                }
              />
              <Route path='producttable' element={<ProductTable/>}/>
              <Route path='customertable' element={<CustomerTable/>}/>
              <Route path='ordertable' element={<OrderTable/>}/>
              <Route path='products' element={<AllProducts/>}/>
            </Routes>         
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} mt={10}>
          <FooterComponent/>
        </Grid>
      </Grid>    
      
      <ToastContainer autoClose={2000}/>
    </div>
  );
}

export default App;
