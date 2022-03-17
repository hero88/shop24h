import {Container, Row, Col, Breadcrumb, BreadcrumbItem} from 'reactstrap';

import FilterComponent from './FilterComponent';

import ProductList from './ProductList';

import {useState, useEffect} from 'react';

function HomepageContent(){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const [products, setProducts] = useState([]);
    const [searchObj, setSearchObj] = useState({});

    useEffect(() => {
        let isContinued = true;        
        fetchApi("http://localhost:8000/products/")
                .then(response => {                
                    if (isContinued) setProducts(response.products);
                })
                .catch(error => console.log(error))        
        return () => isContinued = false;
    }, []);

    return(
        <Container>                                               
            <Row>
                <Col xs='12' sm='12' md='12' lg='12'>
                    <Breadcrumb tag="nav" className="mt-5">
                        <BreadcrumbItem tag="a" href="/" active>Trang chủ</BreadcrumbItem>                            
                    </Breadcrumb>
                </Col>
                <Col sm='3' xs='5'>
                    <FilterComponent sendFilterObj={setSearchObj}/>
                </Col>
                <Col sm='9' xs='7'>
                    <ProductList data={products} searchData={searchObj}/>                    
                </Col>
            </Row>            
        </Container>
    )
}

export default HomepageContent;