import { useParams} from "react-router-dom";

import {Grid, Button} from '@mui/material';
import {Col, Breadcrumb, BreadcrumbItem, Container, Card, CardBody, CardFooter, CardImg} from 'reactstrap';
import {useState, useEffect} from 'react';
import { toast } from 'react-toastify';

import {AddCart} from '../../actions'
import {useDispatch} from 'react-redux';

function ProductDetail({currentUser, sendProduct}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const productURL = "https://vast-castle-13621.herokuapp.com/products";

    const getDiscount = (oldP, newP) => {
        let value = 100 * (oldP - newP) / oldP;
        return parseInt(value);
    }

    const {id} = useParams();
    const dispatch = useDispatch();
    const [NoItem, setNoItem] = useState(1);
    const [currentProduct, setCurrentProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    const substractItem = () => {
        if (NoItem > 0 ) setNoItem(NoItem-1); /*số lượng item min=0*/
    }

    const onBtnAddToCartClick = () => {
        if (!currentUser) {
            toast.error("Bạn cần phải đăng nhập!");
            return false;
        }
        else {
            let selectedProduct = {
                name: currentProduct.name,
                quantity: NoItem,
                productId: id,
                price: currentProduct.promotionPrice,
                image: currentProduct.imageUrl
            };
            sendProduct(selectedProduct);
            dispatch(AddCart(selectedProduct));
        }
    }
    
    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal;        
        fetchApi(productURL, {signal: signal})
            .then(response => {           
                    let productDB = response.products;
                    setCurrentProduct(productDB.find(el => id===el._id));
                    setRelatedProducts(productDB.filter(el => currentProduct.type === el.type && currentProduct._id !== el._id));
            })
            .catch(error => console.log(error))
        
        return ()=> controller.abort();
    },[currentProduct,id])
    
    return(
        <Container >
            <br/>
            <Col xs='12' sm='12' md='12' lg='12'>
                <Breadcrumb tag="nav" className="mt-3">
                        <BreadcrumbItem tag="a" href="/">Trang chủ</BreadcrumbItem>     
                        <BreadcrumbItem tag='a' href='/products'>Sản phẩm</BreadcrumbItem>     
                        <BreadcrumbItem href="/products/:id" active>{currentProduct.name}</BreadcrumbItem>                  
                </Breadcrumb>
            </Col>
            <Grid container spacing={2} mt={2} >
                <Grid item xs={12} md={4} lg={4} sm={4}>
                    <img src={currentProduct.imageUrl} alt='imageDraft' width='60%'/>
                </Grid>
                <Grid item xs={12} md={7} lg={7} sm={7}>
                    <h4>{currentProduct.name}</h4>
                    <p>Loại: {currentProduct.type}</p>
                    <p className='text-decoration-line-through'>{(currentProduct.buyPrice * NoItem).toLocaleString()} VND</p>
                    <p className='text-danger'>{(currentProduct.promotionPrice * NoItem).toLocaleString()} VND (giảm {getDiscount(currentProduct.buyPrice, currentProduct.promotionPrice)}%)</p>
                    <button onClick={substractItem}>-</button>
                    &nbsp;{NoItem >= 0 ? NoItem : 0 /*số lượng item min=0*/ }&nbsp; 
                    <button onClick={()=> setNoItem(NoItem + 1 )}>+</button>
                    <br/><br/>
                    <Button color='primary' variant='contained' onClick={onBtnAddToCartClick}>                   
                        Thêm vào giỏ hàng
                    </Button>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <h3>MÔ TẢ</h3>
                    <p>{currentProduct.description}</p>
                </Grid> 
            </Grid>
            <br/><br/>
            {
                relatedProducts.length > 0
                ?                 
                <Grid container spacing={2} >
                    <Grid item xs={12} md={12} lg={12}>
                        <h5>Sản phẩm liên quan</h5>
                    </Grid>
                    {
                        relatedProducts.map((element, index)=>
                            <Grid item sm={ 12/relatedProducts.length > 4 ? 12/relatedProducts.length : 4 } key={index} xs={12}>
                                <Card className='mb-4' style={{height: '50%'}}>
                                        <a href={"/products/" + element._id} data-toggle='tooltip' title='Click for details'>
                                            <CardImg src={element.imageUrl} top alt='photo_something' style={{objectFit:'cover'}} width='250px' height='250px'/>
                                        </a>                            
                                        <CardBody>
                                            <h4 style={{whiteSpace: 'pre', textOverflow: 'ellipsis', overflow:'hidden'}}>{element.name}</h4>
                                        </CardBody>
                                        <CardFooter>
                                            <p className='text-decoration-line-through'>{element.buyPrice.toLocaleString()} VND</p>
                                            <p className='text-danger'>{element.promotionPrice.toLocaleString()} VND (giảm {getDiscount(element.buyPrice, element.promotionPrice)}%)</p>
                                        </CardFooter>
                                </Card>
                            </Grid>
                        )
                    }                    
                </Grid>                    
                : <p>Không có sản phẩm liên quan...</p>
            }
        </Container>
    )
}

export default ProductDetail;