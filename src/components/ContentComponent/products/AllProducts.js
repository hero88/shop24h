import {Container, Row, Col, Breadcrumb, BreadcrumbItem} from 'reactstrap';

import FilterComponent from '../FilterComponent';
import { useSelector } from 'react-redux';
import ProductList from './ProductList';

import {useState} from 'react';

function AllProducts() {
    const products = useSelector(state => state._todoProduct._products);
    const [searchObj, setSearchObj] = useState({});

    return(
        <Container>                                               
            <Row>
                <Col xs='12' sm='12' md='12' lg='12'>
                    <Breadcrumb tag="nav" className="mt-5">
                        <BreadcrumbItem tag="a" href="/" >Trang chủ</BreadcrumbItem>
                        <BreadcrumbItem tag='a' href='/products' active>Sản phẩm</BreadcrumbItem>                            
                    </Breadcrumb>
                </Col>
                <Col sm='3' xs='12'>
                    <FilterComponent sendFilterObj={setSearchObj}/>
                </Col>
                <Col sm='9' xs='12'>
                    <ProductList data={products} searchData={searchObj}/>                    
                </Col>
            </Row>            
        </Container>
    )
}

export default AllProducts;