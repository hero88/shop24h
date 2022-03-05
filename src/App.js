
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

function App() {
  const fetchApi = async (paramUrl, paramOptions = {}) => {
    const response = await fetch(paramUrl, paramOptions);
    const responseData = await response.json();
    return responseData;
  }

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("App user: ", user);
    auth.onAuthStateChanged((result) => {
      setUser(result);
    });    
    fetchApi("http://localhost:8000/products/")
            .then(response => {                
                setProducts(response.products);
            })
            .catch(error => console.log(error));    
  },[user]);  

  return (
    <div >
      <HeaderComponent currentUser={user}/>      
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
        <Route path='products/:id' element={<ProductDetail/>}/>
      </Routes> 
      
      <FooterComponent/>
    </div>
  );
}

export default App;
