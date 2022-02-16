import {Container, Row, Col} from 'reactstrap';

import FilterComponent from './FilterComponent';

import ProductList from './ProductList';

import ProductItems from './../../data.json';

import {useState, useEffect} from 'react';

function HomepageContent(){
    const [products, setProducts] = useState(ProductItems);

    useEffect(() => {
        console.log(products);
    }, [products]);

    return(
        <Container>                        
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