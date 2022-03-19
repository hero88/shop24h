import {Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, CardBody, CardFooter} from 'reactstrap';

import {useState, useEffect} from 'react';
import CarouselSlide from './CarouselSlide';

function HomepageContent(){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const [products, setProducts] = useState([]);
    const [latest, setLatest] = useState([]);

    useEffect(() => {
        let isContinued = true;        
        fetchApi("http://localhost:8000/products/")
                .then(response => {                
                    if (isContinued) {
                        let tempProduct = response.products;
                        let chosenDate = new Date('2022-03-05');
                        let latestArr = tempProduct.filter(el => new Date(el.timeCreated) >= chosenDate);
                        setProducts(tempProduct); 
                        setLatest(latestArr);
                    }
                })
                .catch(error => console.log(error))        
        return () => isContinued = false;
    }, [latest]);

    return(
        <Container fluid>                                               
            <Row>
                <Col xs='12' sm='12' md='12' lg='12'>
                    <Breadcrumb tag="nav" className="mt-5">
                        <BreadcrumbItem tag="a" href="/" active>Trang chủ</BreadcrumbItem>                            
                    </Breadcrumb>
                </Col>
                <Col xs='12' sm='12' md='8' lg='8' className='mb-3'>
                    <CarouselSlide data={products}/>
                </Col>
                <Col xs='12' sm='12' md='4' lg='4' className='mb-3'>
                    <h3 className='text-center text-success'>Kính chào quý khách!!</h3>
                </Col>
            </Row>
                {
                    latest.length > 0
                    ? 
                    <Row>
                        <Col xs='12' sm='12' md='12' lg='12' className='mb-3 mt-3'>
                            <h3 className='text-center text-danger'>Sản phẩm mới nhất</h3>     
                        </Col>    
                        {
                            latest.map((element, index)=>
                                <Col
                                    sm={ 12/latest.length > 4 ? 12/latest.length : 2 }                         
                                    key={index}
                                    xs='auto'
                                >
                                    <Card className='mb-4' style={{height: '50%'}}>
                                        <a href={"/products/" + element._id} data-toggle='tooltip' title='Click for details'>
                                            <img src={element.imageUrl} className='card-img-top' alt='photo_something' width='20%'/>
                                        </a>                            
                                        <CardBody>
                                            <h4>{element.name}</h4>
                                        </CardBody>
                                        <CardFooter>
                                            <p className='text-decoration-line-through'>{element.buyPrice.toLocaleString()} VND</p>
                                            <p className='text-danger'>{element.promotionPrice.toLocaleString()} VND</p>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            )
                        }               
                    </Row>
                    : <Row></Row>
                }
                       
        </Container>
    )
}

export default HomepageContent;