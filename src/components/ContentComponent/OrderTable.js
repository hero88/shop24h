import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination} from "@mui/material";
import { Container } from 'reactstrap';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import InsertOrderModal from "../modal/InsertOrderModal";
import UpdateOrderModal from "../modal/UpdateOrderModal";

function OrderTable() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";
    const orderURL = "http://localhost:8000/orders/";

    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0);
    const limit = 10;

    const [dbUser, setDbUser] = useState(null);
    const [orderList, setOrderList] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [currentOrder, setCurrentOrder] = useState({});

    const [insertModal, setInsertModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    const onBtnAddClick = () => {
        setInsertModal(true);
    }

    const onBtnEditClick = (data) => {        
        setCurrentOrder(data);
        setUpdateModal(true);            
    }

    useEffect(()=>{
        if (FireBaseUser && !dbUser)
            fetchApi(customerURL)
            .then(result=>{
                let customerList = result.customers;
                let tempUser = customerList.find(el=>el.uid===FireBaseUser.uid);
                if (tempUser) setDbUser(tempUser);
                setCustomers(customerList);
            })
            .catch(error=>console.log(error))

        fetchApi(orderURL)
            .then(data=>{
                let tempList = data.Order;
                setOrderList(tempList);
            })
            .catch(error=>console.log(error))
        

        if (orderList.length > 0){
            let total = orderList.length;
            setNoPage(Math.ceil(total/limit));
        }
    }, [dbUser, FireBaseUser, orderList]);

    return(
        <Container>
            {
                (FireBaseUser && dbUser && dbUser.role === "Admin")
                ? 
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} className='text-center'>
                        <h2 className="fw-bold">Danh sách sản phẩm</h2>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Button variant="contained" color='success' onClick={onBtnAddClick}>Thêm đơn hàng</Button>
                    </Grid>            
                    {
                        orderList.length > 0
                        ?
                            <Grid item xs={12} md={12} sm={12} lg={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="sample table">
                                    <TableHead style={ {backgroundColor: 'orange'}}>
                                        <TableRow>
                                            <TableCell width='30%'>Mã đơn hàng</TableCell>
                                            <TableCell width='20%'>Ngày tạo</TableCell>
                                            <TableCell width='15%'>Thành tiền(VND)</TableCell>
                                            <TableCell width='15%'>Trạng thái</TableCell>
                                            <TableCell width='20%'> Action </TableCell>
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
                                                    <Button variant='contained' style={{marginRight: 15}} onClick={()=>onBtnEditClick(item)}>Sửa</Button>                                                
                                                </TableCell>
                                            </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                                <Pagination onChange={changeHandler} count={noPage} defaultPage={page} style={{marginTop: 15}}></Pagination>
                            </Grid>                     
                        : <p>Chưa có đơn hàng trong hệ thống!</p>
                    }
                </Grid>
                : <p>Bạn chưa đăng nhập, không có quyền truy cập trang này!</p>
            }
            <InsertOrderModal insert={insertModal} setInsert={setInsertModal} list={customers}/>
            <UpdateOrderModal update={updateModal} setUpdate={setUpdateModal} list={customers} data={currentOrder}/>
        </Container>
    )
}

export default OrderTable;