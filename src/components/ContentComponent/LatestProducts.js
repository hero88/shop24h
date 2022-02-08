import DATA from './../../data.json';

import {Container, Row, Col, Card, CardBody, CardFooter} from 'reactstrap';

function LatestProducts() {
    const lastestItems = DATA.filter(data => data.LatestProduct===true );
    return(
        <Container className='p-4'>
            <Col sm='12' className='text-center fw-bold'>
                <h2>LATEST PRODUCTS</h2>
            </Col>
            <Col sm='12'>
                <Row>
                {
                    lastestItems.map((element, index) => 
                    <Col sm='4'>
                        <Card key={index} className='mb-2'>
                            <img src={element.ImageUrl} className='card-img-top' alt=''/>
                            <CardBody>
                                <h4>{element.Name}</h4>
                                <p>{element.Description}</p>
                            </CardBody>
                            <CardFooter>
                                <h4>Price:</h4>
                                <p className='text-decoration-line-through'>{element.Price.toLocaleString()} VND</p>
                                <p className='text-danger'>{element.PromotionPrice.toLocaleString()} VND</p>
                            </CardFooter>
                        </Card>
                    </Col>
                    )
                }
                </Row>
                
            </Col>
        </Container>
    )
}

export default LatestProducts;