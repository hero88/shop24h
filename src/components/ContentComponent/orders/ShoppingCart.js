
import {Grid, Divider,Button} from '@mui/material';
import {Container} from 'reactstrap';
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShoppingCart({currentCart, currentUser}) {    
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [userId, setUserId] = useState("");

    const customerURL = "http://localhost:8000/customers/";
    const orderURL = "http://localhost:8000/orders/";

    let TotalCart = 0; // total VND amount of the cart
    const TotalPrice = (price,tonggia) =>{
        return Number(price * tonggia).toLocaleString('en-US');
    }

    if (cart.length>0)
        for (let i = 0; i<cart.length; i++) {
            TotalCart += cart[i].quantity * cart[i].price;
    }

    const DecreaseQuantity = (data) => {   
        let copy = [...cart];      
        copy.map((item, index)=>{
            if (item.productId === data.productId) 
                if (copy[index].quantity > 0)
                    copy[index].quantity = copy[index].quantity - 1;
            return copy;
        });
        setCart(copy);
    }

    const IncreaseQuantity = (data) => {
        let copy = [...cart];
        copy.map((item, index)=>{
            if (item.productId === data.productId) 
                copy[index].quantity = copy[index].quantity + 1;
            return copy;
        });
        setCart(copy);
    }

    const createOrderDetail = (paramId) => {
        for (let vI=0; vI < cart.length; vI++) {
            let item = cart[vI];
            let targetURL = orderURL + paramId + "/product/" + item.productId + "/detail/";
            let reqOptions = {
                method: "POST",
                body: JSON.stringify({
                    quantity: item.quantity,
                    priceEach: item.price
                }),
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }
            fetchApi(targetURL, reqOptions)
            .then(result=> console.log(result))
            .catch(err=> console.log(err))
        }
    }

    const onBtnCreateOrder = () => {
        if (userId) {
            let targetURL = customerURL + userId + "/orders";
            let reqOptions = {
                method: 'POST',
                body: JSON.stringify({
                    totalAmount: TotalCart
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }
            if (TotalCart === 0 ){
                toast.error("Bạn chưa có sản phẩm nào !");
                return false;
            }
            else
                fetchApi(targetURL, reqOptions)
                .then(result =>{
                    let order = result.order;
                    toast.success("Tạo đơn hàng thành công với id: " + order._id);
                    createOrderDetail(order._id);
                    localStorage.setItem('cart',[]);
                    setTimeout(()=> window.location.reload(), 2000);
                })
                .catch(err=>console.log(err));
        }
    }

    useEffect(()=>{
        let isContinued = true; 
        if (cart.length === 0) setCart(currentCart);
        if (currentUser) {
            fetchApi(customerURL)
                .then(result =>{
                    if (isContinued) {
                        let customerList = result.customers;
                        let tempUserProvider = customerList.find(el=>currentUser.providerData[0].uid === el.uid);
                        let tempUser = customerList.find(el=> el.uid === currentUser.uid);
                        if (tempUserProvider) setUserId(tempUserProvider._id);
                        if (tempUser) setUserId(tempUser._id);
                    }                    
                })
                .catch(err=> console.log(err))
            }
        
        return ()=> isContinued = false;
    }, [cart, currentCart, currentUser])

    return(
        <Container className='mt-4'>            
            {   
                cart.length > 0
                ? 
                <div>
                <Grid container spacing={2} mb={5}>
                    <Grid item xs={12} md={12} lg={12}>
                        <h2 className='text-center text-danger'>Sản phẩm trong giỏ hàng của bạn</h2>
                    </Grid>
                </Grid>
                    {
                        cart.map((item, index)=> 
                        <Grid container spacing={4} key={index}>
                            <Grid item xs={12} sm={4} md={4} lg={4}>
                                <a href={"/products/" + item.productId} data-toggle='tooltip' title='Click for details'>
                                    <img src={item.image} alt='pic' width='70%'/>
                                </a>
                            </Grid>
                            <Grid item xs={12} sm={8} md={8} lg={8}>
                                <h4 className='fw-bold'>{item.name}</h4>
                                <p>Số lượng: </p>
                                <Button onClick={() => DecreaseQuantity(item)} size='small' variant='contained'>-</Button>
                                <span className='fw-bold m-2'>{item.quantity}</span> 
                                <Button onClick={()=> IncreaseQuantity(item)} size='small' variant='contained'>+</Button> 
                                <p className='mt-2 fst-italic'>Thành tiền: {TotalPrice(item.price, item.quantity)} VND</p>
                            </Grid>                                                       
                            <Divider style={{width: '100%', marginTop: '10px', marginBottom: '15px'}} />                
                        </Grid>
                        )
                    }
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <p className='fw-bold'>Tổng cộng: {Number(TotalCart).toLocaleString('en-US')} VND</p>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Button variant='contained' color='success' onClick={()=>navigate('/products')}>Thêm sản phẩm</Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Button variant='contained' 
                                color='success' 
                                                onClick={()=>{
                                                    localStorage.setItem('cart', JSON.stringify(cart));
                                                    toast.success("Cập nhật giỏ hàng thành công !");
                                                }}
                        >
                                            Cập nhật giỏ hàng
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                        <Button variant='contained' color='success' onClick={onBtnCreateOrder}>Đặt hàng</Button>
                    </Grid>                                      
                </Grid>
                </div>                 
                : <h4>Giỏ hàng trống, bạn chưa có sản phẩm nào !</h4>
            }
            <ToastContainer autoClose={2000}/>
        </Container>
    )
}
  
export default ShoppingCart;
