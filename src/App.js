
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import { Route, Routes } from 'react-router-dom';

import Login from './components/ContentComponent/Login';

import {useState, useEffect} from 'react';
import {auth} from './firebase'
import ProductDetail from './components/ContentComponent/ProductDetail';
import ShoppingCart from './components/ContentComponent/ShoppingCart';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/ContentComponent/Profile';
import MyOrders from './components/ContentComponent/MyOrders';
import SignUp from './components/ContentComponent/SignUp';
import ProductTable from './components/ContentComponent/ProductTable';
import CustomerTable from './components/ContentComponent/CustomerTable';
import OrderTable from './components/ContentComponent/OrderTable';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

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
      <HeaderComponent currentUser={user} />        
      <br/><br/><br/>
      <Routes>
        <Route path='/login' element={<Login sendUser={setUser}/>}/>
        <Route path='/' element={<HomepageContent/>}/>
        <Route path='*' element={<HomepageContent/>}/>
        <Route path='products/:id' element={<ProductDetail currentUser={user} sendProduct={cartHandle}/>}/>
        <Route path='shoppingcart' element={<ShoppingCart currentCart={cart} currentUser={user}/>}/>
        <Route path='profile' element={<Profile/>}/>
        <Route path='orders' element={<MyOrders/>}/>
        <Route path='signup' element={<SignUp/>}/>
        <Route path='producttable' element={<ProductTable/>}/>
        <Route path='customertable' element={<CustomerTable/>}/>
        <Route path='ordertable' element={<OrderTable/>}/>
      </Routes> 
      
      <FooterComponent/>
      <ToastContainer autoClose={2000}/>
    </div>
  );
}

export default App;
