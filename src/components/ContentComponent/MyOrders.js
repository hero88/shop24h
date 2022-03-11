import {TableContainer, Grid, Table, Paper, TableHead, TableRow, TableCell, TableBody, Button} from '@mui/material';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import {useNavigate} from 'react-router-dom';

function MyOrders() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";
    const orderURL = "http://localhost:8000/orders/";

    const [user, setUser] = useState(null);
    const [orderList, setOrderList] = useState([]);

    const onBtnDeleteClick = data => {
        let vId = data._id;

        let reqOptions = {
            method: "DELETE"
        }
        fetchApi(orderURL + vId, reqOptions)
        .then(() => {
            toast.success("Xóa thành công đơn hàng !");
            setTimeout(() => window.location.reload(), 2000);
        })
        .catch(error => toast.error("Lỗi rồi: " + error))
    }

    const onBtnPayClick = data => {
        let vId = data._id;
        let copy = orderList;
        copy.map((item, index)=>{
            if (item._id === vId) copy[index].status = 1;
            return copy;
        });
        setOrderList(copy);

        let reqOptions = {
            method: 'PUT',
            headers: {"Content-Type": "application/json; charset=UTF-8"},
            body: JSON.stringify({
                status: 1
            })
        }
        fetchApi(orderURL + vId, reqOptions) // update data in server
        .then(response => {
            toast.success("Cám ơn bạn đã thanh toán !");    
            console.log(response);
        })
        .catch(error => toast.error("Lỗi rồi: " + error))
    }

    useEffect(() => {
        if (!user)
            fetchApi(customerURL)
                .then(result =>{
                    let customerList = result.customers;
                    let tempUserProvider = customerList.find(el=>FireBaseUser.providerData[0].uid === el.uid);
                    let tempUser = customerList.find(el=> el._id === FireBaseUser._id);
                    if (tempUserProvider) setUser(tempUserProvider);
                    if (tempUser) setUser(tempUser);
                })
                .catch(err=> console.log(err))
        
        if (user) 
            fetchApi(customerURL + user._id + '/orders')
            .then(result =>{
                let temp = result.Orders.orders;
                if (temp.length > 0) setOrderList(temp);
            })
            .catch(err=>console.log(err.message))
    }, [user, FireBaseUser, orderList])
    return(
    <>
        <Container>
            {
                orderList.length>0
                ?
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={12} sm={12} md={12} className='text-center'>
                            <h2 className="fw-bold">Danh sách đơn hàng</h2>
                        </Grid>
                        <Grid item xs={12} md={12} sm={12} lg={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="sample table">
                                <TableHead style={ {backgroundColor: 'orange'}}>
                                    <TableRow>
                                        <TableCell >Mã đơn hàng</TableCell>
                                        <TableCell >Ngày tạo</TableCell>
                                        <TableCell >Thành tiền(VND)</TableCell>
                                        <TableCell > Trạng thái</TableCell>
                                        <TableCell > Action </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        orderList.map((item, index) => 
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                {item._id}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.timeCreated).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{item.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell>{item.status === 0 ? 'Not Paid' : 'Paid' }</TableCell>
                                            <TableCell>
                                                <Button variant='contained' style={{marginRight: 15}} onClick={()=>onBtnPayClick(item)}>Thanh toán</Button>
                                                <Button variant='contained' color='error' onClick={()=>onBtnDeleteClick(item)}>Xóa</Button>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                : <p>Bạn chưa có đơn hàng nào!</p>
            }            
        </Container>
    </>
    )
}

export default MyOrders;