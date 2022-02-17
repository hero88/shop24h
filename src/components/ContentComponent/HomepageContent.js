import {Container, Row, Col} from 'reactstrap';

import FilterComponent from './FilterComponent';

import ProductList from './ProductList';

import ProductItems from './../../data.json';

import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

function HomepageContent(){
    const [products, setProducts] = useState(ProductItems);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return(
        <Container>   
            <Row className='mb-3'>
                <Link to='/product'>Products</Link>
            </Row>                     
            <Row>
                <Col sm='4'>
                    <FilterComponent sendFilteredProduct={setProducts}/>
                </Col>
                <Col sm='8'>
                    <ProductList data={products}/>
                    
                </Col>
            </Row>            
        </Container>
    )
}

export default HomepageContent;