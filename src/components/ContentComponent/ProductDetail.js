import { useParams } from "react-router-dom";

import {Container, Grid, IconButton} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';
import {useState, useEffect} from 'react';

function ProductDetail() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const {id} = useParams();
    const [NoItem, setNoItem] = useState(1);
    const [currentProduct, setCurrentProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    const substractItem = () => {
        if (NoItem > 0 ) setNoItem(NoItem-1); /*số lượng item min=0*/
    }
    
    useEffect(()=>{
        fetchApi("http://localhost:8000/products/")
            .then(response => {                
                let productDB = response.products;
                setCurrentProduct(productDB.find(el => id===el._id));
                setRelatedProducts(productDB.filter(el => currentProduct.type === el.type && currentProduct._id !== el._id));
            })
            .catch(error => console.log(error))
    },[currentProduct,id])
    
    return(
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={4} md={4} lg={4}>
                    <img src={currentProduct.imageUrl} alt='imageDraft' width='60%'/>
                </Grid>
                <Grid item xs={7} md={7} lg={7}>
                    <h4>{currentProduct.name}</h4>
                    <p>Type: {currentProduct.type}</p>
                    <p className='text-decoration-line-through'>{(currentProduct.buyPrice * NoItem).toLocaleString()} VND</p>
                    <p className='text-danger'>{(currentProduct.promotionPrice * NoItem).toLocaleString()} VND</p>
                    <button onClick={substractItem}>-</button>
                    &nbsp;{NoItem >= 0 ? NoItem : 0 /*số lượng item min=0*/ }&nbsp; 
                    <button onClick={()=> setNoItem(NoItem + 1 )}>+</button>
                    <br/>
                    <IconButton color='primary'>
                        <FontAwesomeIcon icon={faShoppingBasket}/>&nbsp;                     
                        Thêm vào giỏ hàng
                    </IconButton>
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <h5>Sản phẩm liên quan</h5>
                    </Grid>
                    {
                        relatedProducts.map((element, index)=>
                            <Grid item xs={ 12/relatedProducts.length > 4 ? 12/relatedProducts.length : 4 } key={index}>
                                <a href={"/products/" + element._id} data-toggle='tooltip' title='Click for details'>
                                    <img src={element.imageUrl} alt='' width='30%'/>
                                </a>
                                <p className="fw-bold">{element.name}</p>
                                <p className='text-decoration-line-through'>{element.buyPrice.toLocaleString()} VND</p>
                                <p className='text-danger'>{element.promotionPrice.toLocaleString()} VND</p>
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