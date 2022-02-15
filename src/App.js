
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from './components/HeaderComponent/HeaderComponent';
import FooterComponent from './components/FooterComponent/FooterComponent';
import HomepageContent from './components/ContentComponent/HomepageContent';

import {Row, BreadcrumbItem, Breadcrumb } from 'reactstrap';

function App() {
  return (
    <div >
      <HeaderComponent/>      
      <Row className='mt-5 p-4'>
          <Breadcrumb tag="nav">
            <BreadcrumbItem tag="a" href="/">Home</BreadcrumbItem>
            <BreadcrumbItem active>All Products</BreadcrumbItem>
          </Breadcrumb>
      </Row>      
      <HomepageContent/>
      <FooterComponent/>
    </div>
  );
}

export default App;
