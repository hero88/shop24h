import {Grid, Pagination} from '@mui/material';
import {useState, useEffect} from 'react';
import {Container, Row, Col, Card, CardBody, CardFooter, CardImg} from 'reactstrap';
import { fetchApi } from '../../../api';

function ProductList({data, searchData}) {  

    const [productList, setProductList] = useState(data);
    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0);
    const [limit, setLimit] = useState(3);

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    const getDiscount = (oldP, newP) => {
        let value = 100 * (oldP - newP) / oldP;
        return parseInt(value);
    }

    const changeSelectHandler = e => setLimit(e.target.value);
    const baseURL = "https://vast-castle-13621.herokuapp.com/products/?";

    useEffect(() => {
        let targetURL = "";
        const controller = new AbortController();
        const signal = controller.signal; 
            if ((Object.keys(searchData).length===0)
                || (!searchData.name && searchData.minPrice === 0 && searchData.maxPrice === 0 && searchData.type==="None")
            )
                targetURL = baseURL;
            else{
                targetURL = baseURL;
                if (searchData.name) targetURL +=  "&name=" + searchData.name;
                if (searchData.minPrice) targetURL += "&minPrice=" + searchData.minPrice;
                if (searchData.maxPrice) targetURL += "&maxPrice=" + searchData.maxPrice;
                if (searchData.type) targetURL += "&type=" + searchData.type;            
            }
            fetchApi(targetURL, {signal: signal})
                .then(response => {
                    setNoPage(Math.ceil(response.count/limit));
                })
                .catch(err => console.log(err));

            targetURL += "&limit=" + limit + "&page=" + page; // do pagination

            fetchApi(targetURL, {signal: signal})
                .then(response => {
                    setProductList(response.products);
                })
                .catch(error => console.log(error));
        
        return ()=> controller.abort();

    }, [page, limit, searchData]);

    return(
        <Container className='p-4'>            
            <Col sm='12' className='mb-3'>
                    <label>Chọn số lượng sản phẩm hiển thị &nbsp;</label>
                    <select onChange={changeSelectHandler} defaultValue={3}>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                    </select>
            </Col>
            <Col sm='12'>
                <Row>
                {
                    productList.map((element, index) => 
                    <Col 
                        sm={ 12/productList.length > 4 ? 12/productList.length : 4 }                         
                        key={index}
                        xs='auto'
                    >
                        <Card className='mb-2'>
                            <a href={"/products/" + element._id} data-toggle='tooltip' title='Click for details'>
                                <CardImg src={element.imageUrl} top alt='photo_something' style={{objectFit:'cover'}} width='250px' height='250px'/>
                            </a>                            
                            <CardBody>
                                <h4 style={{whiteSpace: 'pre', textOverflow: 'ellipsis', overflow:'hidden'}}>{element.name}</h4>
                            </CardBody>
                            <CardFooter>
                                <h4>Giá tiền:</h4>
                                <p className='text-decoration-line-through'>{element.buyPrice.toLocaleString()} VND</p>
                                <p className='text-danger'>{element.promotionPrice.toLocaleString()} VND (giảm {getDiscount(element.buyPrice, element.promotionPrice)}%)</p>
                            </CardFooter>
                        </Card>
                    </Col>
                    )
                }
                </Row>                
            </Col>
            <Grid item xs={12} md={12} sm={12} lg={12} marginTop={5} marginBottom={5}>                
                <Pagination onChange={changeHandler} count={noPage} defaultPage={1}></Pagination>
            </Grid>         
        </Container>
    )
}

export default ProductList;