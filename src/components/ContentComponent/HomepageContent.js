import {Container, Row, Col, Card, CardBody, CardFooter, Button} from 'reactstrap';
import {GetAllProduct} from '../actions';
import {useSelector, useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import CarouselSlide from './CarouselSlide';

function HomepageContent(){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const [latest, setLatest] = useState([]);
    const productURL = "https://vast-castle-13621.herokuapp.com/products/";
    const allProducts = useSelector(state => state._todoProduct._products);
    const dispatch = useDispatch();

    useEffect(() => {   
        const controller = new AbortController();
        const signal = controller.signal;    

        fetchApi(productURL, {signal: signal})
                .then(response => {   
                        let tempProduct = response.products;
                        let chosenDate = new Date('2022-03-05');
                        let latestArr = tempProduct.filter(el => new Date(el.timeCreated) >= chosenDate);
                        if (tempProduct.length>=0) dispatch(GetAllProduct(tempProduct));
                        setLatest(latestArr);
                })
                .catch(error => console.log(error))        
        return () => controller.abort();
    }, [latest, dispatch]);

    return(
        <Container fluid>                                               
            <Row>                
                <Col xs='12' sm='12' md='12' lg='12' className='mb-3'>
                    <CarouselSlide data={allProducts}/>
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
                                            <h5 style={{whiteSpace: 'pre', textOverflow: 'ellipsis', overflow:'hidden'}}>{element.name}</h5>
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
            <Row>
                <Col sm='12' xs='12' className='text-center'>
                    <Button className='btn-primary' onClick={()=>window.location.href = '/products'}>Đến trang sản phẩm</Button>
                </Col>
            </Row>           
        </Container>
    )
}

export default HomepageContent;