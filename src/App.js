
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import {Row, BreadcrumbItem, Breadcrumb } from 'reactstrap';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ContentComponent/ProductList';

import ProductItems from './data.json';

function App() {
  return (
    <div >
      <HeaderComponent/>      
      <Row className='mt-5 p-4'>
          <Breadcrumb tag="nav">
            <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>            
          </Breadcrumb>
      </Row>     
      <Routes>
        <Route path='/' element={<HomepageContent/>}/>
        <Route path='product' element={<ProductList data={ProductItems}/>}/>
      </Routes> 
      
      <FooterComponent/>
    </div>
  );
}

export default App;
