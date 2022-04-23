import {TableContainer, Grid, Table, Paper, TableHead, TableRow, TableCell, TableBody, Button} from '@mui/material';
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';
import { fetchApi } from '../../../api';
import {auth} from '../../../firebase';
import OrderDetailModal from '../../modal/OrderDetailModal';
import DeleteOrderModal from '../../modal/DeleteOrderModal';

function MyOrders() {

    const FireBaseUser = auth.currentUser;
    const customerURL = "https://vast-castle-13621.herokuapp.com/customers/";
    const orderURL = "https://vast-castle-13621.herokuapp.com/orders/";

    const [user, setUser] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const onItemIdClick = data => {
        setOpenModal(true);
        setCurrentOrder(data);
    }

    const onBtnDeleteClick = data => {
        setDeleteModal(true);
        setCurrentOrder(data);
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
        let isContinued = true;        
        if (!user)
            fetchApi(customerURL)
                .then(result =>{
                    if (isContinued) {
                        let customerList = result.customers;
                        let tempUserProvider = customerList.find(el=>FireBaseUser.providerData[0].uid === el.uid);
                        let tempUser = customerList.find(el=> el.uid === FireBaseUser.uid);
                        if (tempUserProvider) setUser(tempUserProvider);
                        if (tempUser) setUser(tempUser);
                    }                    
                })
                .catch(err=> console.log(err))
        
        if (user) 
            fetchApi(customerURL + user._id + '/orders')
                .then(result =>{     
                    if (isContinued) {              
                        let temp = result.Orders.orders;
                        setOrderList(temp);
                    }                                        
                })
                .catch(err=>console.log(err.message))        
        
        return ()=> isContinued=false;
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
                                                <Button onClick={()=>onItemIdClick(item)}>{item._id}</Button>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(item.timeCreated).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>{item.totalAmount.toLocaleString()}</TableCell>
                                            <TableCell>{item.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán' }</TableCell>
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
                : <h4>Bạn chưa có đơn hàng nào!</h4>
            }            
        </Container>
        <OrderDetailModal open={openModal} setOpen={setOpenModal} data={currentOrder}/> 
        <DeleteOrderModal deleteModal={deleteModal} setDelete={setDeleteModal} order={currentOrder}/>       
    </>
    )
}

export default MyOrders;