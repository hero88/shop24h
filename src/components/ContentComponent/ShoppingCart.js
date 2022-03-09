
import {TableContainer, Grid, Table, Paper, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import {Container} from 'reactstrap';
import {useState, useEffect} from 'react';

function ShoppingCart({currentCart}) {    
    const [cart, setCart] = useState([]);
    let TotalCart = 0;
    const TotalPrice = (price,tonggia) =>{
        return Number(price * tonggia).toLocaleString('en-US');
    }

    if (cart.length>0)
        for (let i = 0; i<cart.length; i++) {
            TotalCart += cart[i].quantity * cart[i].price;
    }

    const DecreaseQuantity = (data) => {   
        let copy = [...cart];
        let newAmount = data.quantity > 0 ? data.quantity - 1 : data.quantity;
        copy.map((item, index)=>{
            if (item.productId === data.productId) 
                copy[index].quantity = copy[index].quantity - 1;
            return copy;
        });
        setCart(copy);
        return newAmount;
    }

    const IncreaseQuantity = (data) => {
        let copy = [...cart];
        let newAmount = data.quantity + 1;
        copy.map((item, index)=>{
            if (item.productId === data.productId) 
                copy[index].quantity = copy[index].quantity + 1;
            return copy;
        });
        setCart(copy);
        
        return newAmount;
    }

    useEffect(()=>{
        if (cart.length === 0) setCart(currentCart);
    }, [cart, currentCart])

    return(
        <Container>
            {   
                cart.length > 0
                ? 
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <h5>Sản phẩm của bạn</h5>
                    </Grid>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="sample table">
                            <TableHead style={ {backgroundColor: 'orange'}}>
                                <TableRow>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Số lượng</TableCell>
                                    <TableCell>Thành tiền(VND)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    cart.map((item, index) => 
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <a href={"/products/" + item.productId} data-toggle='tooltip' title='Click for details'>
                                                <img src={item.image} alt='pic' width='20%'/>
                                            </a>
                                            <p className='fw-bold'>{item.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <button onClick={() => DecreaseQuantity(item)}>-</button>
                                            &nbsp;{item.quantity}&nbsp; 
                                            <button onClick={()=> IncreaseQuantity(item)}>+</button>
                                        </TableCell>
                                        <TableCell>{TotalPrice(item.price, item.quantity)}</TableCell>
                                    </TableRow>
                                    )
                                }
                                <TableRow>
                                    <TableCell>Total Carts: </TableCell>
                                    <TableCell>{Number(TotalCart).toLocaleString('en-US')}</TableCell>
                                </TableRow>
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>                   
                </Grid> 
                : <p>Bạn chưa có sản phẩm nào !</p>
            }
        </Container>
    )
}
  
export default ShoppingCart;
