import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination} from "@mui/material";
import { Container } from 'reactstrap';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import UpdateCustomerModal from "../modal/UpdateCustomerModal";

function CustomerTable(){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";

    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(1);    
    const changeHandler = (event, value) => {
        setPage(value);        
    }
    const limit = 10;

    const [dbUser, setDbUser] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [currentCustomer,setCurrentCustomer] = useState({});
    const [updateModal, setUpdateModal] = useState(false);

    const onBtnEditClick = (data) => {
        setCurrentCustomer(data);
        setUpdateModal(true);
    }

    const onBtnAddClick = () => {
        window.location.href='/signup';
    }

    useEffect(()=>{        
        if (FireBaseUser && !dbUser)
            fetchApi(customerURL)
            .then(result=>{
                let customerList = result.customers;
                let tempUser = customerList.find(el=>el.uid===FireBaseUser.uid);
                let tempCustomers = customerList.filter(el=>el.role==="Customer");
                if (tempUser) setDbUser(tempUser);
                setCustomers(tempCustomers);
                setNoPage(Math.ceil(tempCustomers.length/limit));
            })
            .catch(error=>console.log(error))        
    },[FireBaseUser, dbUser])

    return(
        <Container>
            {
                (FireBaseUser && dbUser && dbUser.role === "Admin")
                ?
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} className='text-center'>
                        <h2 className='fw-bold'>Danh sách khách hàng</h2>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Button variant="contained" color='success' onClick={onBtnAddClick}>Thêm khách hàng</Button>
                    </Grid> 
                    {
                        customers.length > 0
                        ?
                        <Grid item xs={12} md={12} sm={12} lg={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="sample table">
                                <TableHead style={ {backgroundColor: 'orange'}}>
                                    <TableRow>
                                        <TableCell width='30%'>Tên khách hàng</TableCell>
                                        <TableCell width='20%'>Số điện thoại</TableCell>
                                        <TableCell width='15%'>Email</TableCell>
                                        <TableCell width='15%'>Ngày đăng ký</TableCell>
                                        <TableCell width='20%'> Action </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        customers.map((item, index) => 
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                {item.fullName}
                                            </TableCell>
                                            <TableCell>
                                                {item.phoneNumber}
                                            </TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{new Date(item.timeCreated).toLocaleDateString() }</TableCell>
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
                        : <p>Chưa có khách hàng trong hệ thống!</p>
                    }
                </Grid>
                : <p>Bạn chưa đăng nhập, không có quyền truy cập trang này!</p>
            }
            <UpdateCustomerModal update={updateModal} setUpdate={setUpdateModal} customer={currentCustomer}/>
        </Container>
    )
}

export default CustomerTable;