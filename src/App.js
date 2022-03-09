
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import {Row, BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ContentComponent/ProductList';

import Login from './components/ContentComponent/Login';

import {useState, useEffect} from 'react';
import {auth} from './firebase'
import ProductDetail from './components/ContentComponent/ProductDetail';
import ShoppingCart from './components/ContentComponent/ShoppingCart';

function App() {
  const fetchApi = async (paramUrl, paramOptions = {}) => {
    const response = await fetch(paramUrl, paramOptions);
    const responseData = await response.json();
    return responseData;
  }

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const cartHandle = (data) => {
    let selectedProduct = data;
    if (cart.length === 0) { // cart empty 
      setCart(cart=>[...cart,selectedProduct]);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    else {
      let check = false; // new item to cart
      let newArr = [...cart];      
      newArr.map((item, index) => {
          if (item.productId === selectedProduct.productId) {
            check = true;
            newArr[index].quantity++;
          }
          return newArr;
      })
      if (!check) {
        setCart(cart=>[...cart, selectedProduct]);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
      else {
        setCart(newArr);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }        
  }

  useEffect(() => {
    console.log("App user: ", user);     
    console.log(cart);    
    if(cart.length===0) {
      let temp = localStorage.getItem('cart');
      setCart(JSON.parse(temp));
    }

    auth.onAuthStateChanged((result) => {
      setUser(result);
    });    

    fetchApi("http://localhost:8000/products/")
            .then(response => {                
                setProducts(response.products);
            })
            .catch(error => console.log(error));   
  },[user, cart]);  

  return (
    <div >
      <HeaderComponent currentUser={user} />      
      <Row className='mt-5 p-4'>
          <Breadcrumb tag="nav" className="mt-5">
            <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>    
            <BreadcrumbItem tag="a" href="/products">Products</BreadcrumbItem>        
          </Breadcrumb>
      </Row>     
      <br/>
      <Routes>
        <Route path='/login' element={<Login sendUser={setUser}/>}/>
        <Route path='/' element={<HomepageContent/>}/>
        <Route path='products' element={<ProductList data={products} searchData={{}}/>}/>
        <Route path='products/:id' element={<ProductDetail currentUser={user} sendProduct={cartHandle}/>}/>
        <Route path='shoppingcart' element={<ShoppingCart currentCart={cart}/>}/>
      </Routes> 
      
      <FooterComponent/>
    </div>
  );
}

export default App;
