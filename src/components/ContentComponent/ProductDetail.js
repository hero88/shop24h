import { useParams } from "react-router-dom";
import productDB from './../../data.json';
import {Container, Grid, IconButton} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';
import {useState} from 'react';

function ProductDetail() {
    const {id} = useParams();
    const [NoItem, setNoItem] = useState(1);
    let currentProduct = productDB.find(el => parseInt(id)===el.Id);
    let relatedProducts = productDB.filter(el => currentProduct.Type === el.Type && currentProduct.Id !== el.Id);

    const substractItem = () => {
        if (NoItem > 0 ) setNoItem(NoItem-1); /*số lượng item min=0*/
    }
    
    return(
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={4} md={4} lg={4}>
                    <img src={currentProduct.ImageUrl} alt='' width='60%'/>
                </Grid>
                <Grid item xs={7} md={7} lg={7}>
                    <h4>{currentProduct.Name}</h4>
                    <p>Type: {currentProduct.Type}</p>
                    <p className='text-decoration-line-through'>{(currentProduct.Price * NoItem).toLocaleString()} VND</p>
                    <p className='text-danger'>{(currentProduct.PromotionPrice * NoItem).toLocaleString()} VND</p>
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
                    <p>{currentProduct.Description}</p>
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
                                <a href={"/product/" + element.Id} data-toggle='tooltip' title='Click for details'>
                                    <img src={element.ImageUrl} alt='' width='30%'/>
                                </a>
                                <p className="fw-bold">{element.Name}</p>
                                <p className='text-decoration-line-through'>{element.Price.toLocaleString()} VND</p>
                                <p className='text-danger'>{element.PromotionPrice.toLocaleString()} VND</p>
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