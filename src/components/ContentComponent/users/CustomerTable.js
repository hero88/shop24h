import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination, TextField, TableSortLabel} from "@mui/material";
import { Container } from 'reactstrap';
import {useState, useEffect} from 'react';
import { fetchApi } from "../../../api";
import {auth} from '../../../firebase';
import UpdateCustomerModal from "../../modal/UpdateCustomerModal";

function CustomerTable(){
    const FireBaseUser = auth.currentUser;
    const customerURL = "https://vast-castle-13621.herokuapp.com/customers";

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
    const [search, setSearch] = useState("");
    const [DateOrderDirection, setDateOrderDirection] = useState("asc");

    const onBtnEditClick = (data) => {
        setCurrentCustomer(data);
        setUpdateModal(true);
    }

    const onBtnAddClick = () => {
        window.location.href='/signup';
    }

    const changeNameHandler = e => setSearch(e.target.value);

    const sortDateArray = (arr, orderBy) => {
        switch (orderBy) {
            case "asc":
            default:
              return arr.sort((a, b) => {
                let dateA = new Date(a.timeCreated);
                let dateB = new Date(b.timeCreated);
                return dateA > dateB ? 1 : dateB > dateA ? -1 : 0;
              });
            case "desc":
              return arr.sort((a, b) => {
                let dateA = new Date(a.timeCreated);
                let dateB = new Date(b.timeCreated);
                return dateA < dateB ? 1 : dateB < dateA ? -1 : 0;
                });
        }
    }

    const handleSortDateRequest = () => {
        let temp = sortDateArray(customers, DateOrderDirection);
        setCustomers(temp);
        setDateOrderDirection(DateOrderDirection === "asc" ? "desc" : "asc");
    }

    useEffect(()=>{     
        const controller = new AbortController();
        const signal = controller.signal;  
        if (FireBaseUser && !dbUser)
            fetchApi(customerURL, {signal: signal})
            .then(result=>{
                    let customerList = result.customers;
                    let tempUser = customerList.find(el=>el.uid===FireBaseUser.uid);
                    let tempCustomers = customerList.filter(el=>el.role==="Customer");
                    if (tempUser) setDbUser(tempUser); 
                    setCustomers(tempCustomers.slice((page - 1) * limit, page * limit));
                    setNoPage(Math.ceil(tempCustomers.length/limit));              
            })
            .catch(error=>console.log(error))        
        return ()=> controller.abort();
    },[FireBaseUser, dbUser, updateModal, page])

    return(
        <Container className="mt-5">
            {
                (FireBaseUser && dbUser && dbUser.role === "Admin")
                ?
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} className='text-center'>
                        <h2 className='fw-bold'>Danh sách khách hàng</h2>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button variant="contained" color='success' onClick={onBtnAddClick}>Thêm khách hàng</Button>
                    </Grid> 
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <TextField label='Tìm kiếm tên khách hàng' onChange={changeNameHandler}fullWidth/>
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
                                        <TableCell width='15%' onClick={handleSortDateRequest}>
                                            <TableSortLabel active={true} direction={DateOrderDirection}>
                                            Ngày đăng ký
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell width='20%'> Action </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        customers.filter((item)=> {
                                            if (search.length===0) return item;
                                            else return (item.fullName.toLowerCase().includes(search.toLowerCase())) 
                                        }).map((item, index) => 
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
                        : <h4>Chưa có khách hàng trong hệ thống!</h4>
                    }
                </Grid>
                : <h4>Bạn chưa đăng nhập, không có quyền truy cập trang này!</h4>
            }
            <UpdateCustomerModal update={updateModal} setUpdate={setUpdateModal} customer={currentCustomer}/>
        </Container>
    )
}

export default CustomerTable;