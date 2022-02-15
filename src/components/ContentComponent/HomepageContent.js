import {Container, Row, Col} from 'reactstrap';

import FilterComponent from './FilterComponent';
import Navigation from './Navigation';
import ProductList from './ProductList';

import ProductItems from './../../data.json';

function HomepageContent(){
    return(
        <Container>                        
            <Row>
                <Col sm='4'>
                    <FilterComponent/>
                </Col>
                <Col sm='8'>
                    <ProductList data={ProductItems}/>
                    <Navigation data={ProductItems}/>
                </Col>
            </Row>            
        </Container>
    )
}

export default HomepageContent;