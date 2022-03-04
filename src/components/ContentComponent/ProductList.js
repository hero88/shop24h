import {Grid, Pagination} from '@mui/material';
import {useState, useEffect} from 'react';
import {Container, Row, Col, Card, CardBody, CardFooter} from 'reactstrap';


function ProductList({data}) {    
    const [productList, setProductList] = useState(data);
    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0);
    const [limit, setLimit] = useState(3);

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    const changeSelectHandler = e => setLimit(e.target.value);

    useEffect(() => {
        if (data.length>0) {
            setProductList(data.slice((page - 1) * limit, page * limit));
            setNoPage(Math.ceil(data.length / limit));  
        } 
        else {
            setNoPage(1);
            setProductList([]);
        }             
    }, [data, page, limit]);

    return(
        <Container className='p-4'>
            <Col sm='12' className='text-center fw-bold'>
                <h2>PRODUCTS</h2>
            </Col>
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
                    >
                        <Card className='mb-2'>
                            <a href={"/products/" + element._id} data-toggle='tooltip' title='Click for details'>
                                <img src={element.imageUrl} className='card-img-top' alt='photo_something' />
                            </a>                            
                            <CardBody>
                                <h4>{element.name}</h4>
                                <p>{element.description}</p>
                            </CardBody>
                            <CardFooter>
                                <h4>Price:</h4>
                                <p className='text-decoration-line-through'>{element.buyPrice.toLocaleString()} VND</p>
                                <p className='text-danger'>{element.promotionPrice.toLocaleString()} VND</p>
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