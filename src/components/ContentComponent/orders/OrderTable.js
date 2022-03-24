import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination, TextField, TableSortLabel} from "@mui/material";
import { Container } from 'reactstrap';
import {useState, useEffect} from 'react';

import {auth} from '../../../firebase';
import InsertOrderModal from "../../modal/InsertOrderModal";
import UpdateOrderModal from "../../modal/UpdateOrderModal";
import OrderDetailModal from "../../modal/OrderDetailModal";
import DeleteOrderModal from "../../modal/DeleteOrderModal";

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
    const [search, setSearch] = useState("");
    const [PriceOrderDirection, setPriceOrderDirection] = useState("asc");
    const [StatusOrderDirection, setStatusOrderDirection] = useState("asc");
    const [DateOrderDirection, setDateOrderDirection] = useState("asc");

    const [insertModal, setInsertModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    const onBtnAddClick = () => {
        setInsertModal(true);
    }

    const onItemIdClick = data => {
        setOpenModal(true);
        setCurrentOrder(data);
    }

    const onBtnEditClick = (data) => {        
        setCurrentOrder(data);
        setUpdateModal(true);            
    }

    const onBtnDeleteClick = data => {
        setDeleteModal(true);
        setCurrentOrder(data);
    }

    const changeIdHandler = e => setSearch(e.target.value);

    const sortPriceArray = (arr, orderBy) => {
        switch (orderBy) {
          case "asc":
          default:
            return arr.sort((a, b) =>
              a.totalAmount > b.totalAmount ? 1 : b.totalAmount > a.totalAmount ? -1 : 0
            );
          case "desc":
            return arr.sort((a, b) =>
              a.totalAmount < b.totalAmount ? 1 : b.totalAmount < a.totalAmount ? -1 : 0
            );
        }
    };

    const sortStatusArray = (arr, orderBy) => {
        switch (orderBy) {
            case "asc":
            default:
              return arr.sort((a, b) =>
                a.status > b.status ? 1 : b.status > a.status ? -1 : 0
              );
            case "desc":
              return arr.sort((a, b) =>
                a.status < b.status ? 1 : b.status < a.status ? -1 : 0
              );
        }
    }

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

    const handleSortPriceRequest = () => {
        let temp = sortPriceArray(orderList, PriceOrderDirection);
        setOrderList(temp);
        setPriceOrderDirection(PriceOrderDirection === "asc" ? "desc" : "asc");
    };

    const handleSortStatusRequest = () => {
        let temp = sortStatusArray(orderList, StatusOrderDirection);
        setOrderList(temp);
        setStatusOrderDirection(StatusOrderDirection === "asc" ? "desc" : "asc");
    }

    const handleSortDateRequest = () => {
        let temp = sortDateArray(orderList, DateOrderDirection);
        setOrderList(temp);
        setDateOrderDirection(DateOrderDirection === "asc" ? "desc" : "asc");
    }

    useEffect(()=>{
        const controller = new AbortController();
        const signal = controller.signal; 
        if (FireBaseUser && !dbUser) {
            fetchApi(customerURL, {signal: signal})
            .then(result=> {
                    let customerList = result.customers;
                    let tempUser = customerList.find(el=>el.uid===FireBaseUser.uid);
                    if (tempUser) setDbUser(tempUser);
                    setCustomers(customerList);
            })
            .catch(error=>console.log(error))
        }
        fetchApi(orderURL, {signal: signal})
            .then(data=> {
                    let tempList = data.Order;
                    if (tempList) setNoPage(Math.ceil(tempList.length/limit));
                    setOrderList(tempList);
            })
            .catch(error=>console.log(error))        

        return ()=> controller.abort();
    }, [dbUser, FireBaseUser, updateModal, insertModal, deleteModal]);

    return(
        <Container className="mt-5">
            {
                (FireBaseUser && dbUser && dbUser.role === "Admin")
                ? 
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} className='text-center'>
                        <h2 className="fw-bold">Danh sách đơn hàng</h2>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <Button variant="contained" color='success' onClick={onBtnAddClick}>Thêm đơn hàng</Button>
                    </Grid>       
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <TextField label='Tìm kiếm mã đơn hàng' onChange={changeIdHandler} fullWidth/>
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
                                            <TableCell width='20%' onClick={handleSortDateRequest}>
                                                <TableSortLabel active={true} direction={DateOrderDirection}>
                                                    Ngày tạo
                                                </TableSortLabel>                                                
                                            </TableCell>
                                            <TableCell width='15%' onClick={handleSortPriceRequest}>
                                                <TableSortLabel active={true} direction={PriceOrderDirection}>
                                                    Thành tiền(VND)
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell width='15%' onClick={handleSortStatusRequest}>
                                                <TableSortLabel active={true} direction={StatusOrderDirection}>
                                                    Trạng thái
                                                </TableSortLabel>                                                
                                            </TableCell>
                                            <TableCell width='20%'> Action </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            orderList.filter((item)=> {
                                                if (search.length===0) return item;
                                                else return (item._id.toLowerCase().includes(search.toLowerCase())) 
                                            }).map((item, index) => 
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
                                                    <Button variant='contained' style={{marginRight: 15}} onClick={()=>onBtnEditClick(item)}>Sửa</Button>                                                
                                                    <Button variant='contained' color='error' onClick={()=>onBtnDeleteClick(item)}>Xóa</Button>
                                                </TableCell>
                                            </TableRow>
                                            )
                                        }
                                    </TableBody>
                                    </Table>
                                </TableContainer>
                                <span className="m-2 text-center">Page: {page}</span>
                                <Pagination onChange={changeHandler} count={noPage} defaultPage={1} style={{marginTop: 15}}></Pagination>
                            </Grid>                     
                        : <h4>Chưa có đơn hàng trong hệ thống!</h4>
                    }
                </Grid>
                : <h4>Bạn chưa đăng nhập, không có quyền truy cập trang này!</h4>
            }
            <InsertOrderModal insert={insertModal} setInsert={setInsertModal} list={customers}/>
            <UpdateOrderModal update={updateModal} setUpdate={setUpdateModal} list={customers} data={currentOrder}/>
            <OrderDetailModal open={openModal} setOpen={setOpenModal} data={currentOrder}/>
            <DeleteOrderModal deleteModal={deleteModal} setDelete={setDeleteModal} order={currentOrder}/>
        </Container>
    )
}

export default OrderTable;