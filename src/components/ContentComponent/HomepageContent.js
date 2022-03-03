import {Container, Row, Col} from 'reactstrap';

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

    useEffect(() => {
        fetchApi("http://localhost:8000/products/")
            .then(response => {                
                setProducts(response.products);
            })
            .catch(error => console.log(error))        
    }, []);

    return(
        <Container>                                    
            <Row>
                <Col sm='3'>
                    <FilterComponent sendFilteredProduct={setProducts}/>
                </Col>
                <Col sm='9'>
                    <ProductList data={products}/>                    
                </Col>
            </Row>            
        </Container>
    )
}

export default HomepageContent;