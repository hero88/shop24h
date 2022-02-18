
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import {Row, BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ContentComponent/ProductList';

import ProductItems from './data.json';
import Login from './components/ContentComponent/Login';

import {useState, useEffect} from 'react';
import {auth} from './firebase'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("App user: ", user);
    auth.onAuthStateChanged((result) => {
      setUser(result);
    })
  },[user]);  

  return (
    <div >
      <HeaderComponent currentUser={user}/>      
      <Row className='mt-5 p-4'>
          <Breadcrumb tag="nav">
            <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>            
          </Breadcrumb>
      </Row>     
      <br/>
      <Routes>
        <Route path='/login' element={<Login sendUser={setUser}/>}/>
        <Route path='/' element={<HomepageContent/>}/>
        <Route path='product' element={<ProductList data={ProductItems}/>}/>
      </Routes> 
      
      <FooterComponent/>
    </div>
  );
}

export default App;
