import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Pagination} from "@mui/material";
import { Container } from 'reactstrap';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import InsertProductModal from "../modal/InsertProductModal";
import UpdateProductModal from "../modal/UpdateProductModal";
import DeleteProductModal from "../modal/DeleteProductModal";

function ProductTable() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";
    const productURL = "http://localhost:8000/products/";
    
    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0);
    const limit = 10;

    const [dbUser, setDbUser] = useState(null);
    const [productList, setProductList] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({});
    const [insertModal, setInsertModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    const onBtnAddClick = () => {
        setInsertModal(true);
    }

    const onBtnEditClick = (data) => {        
        setCurrentProduct(data);
        setUpdateModal(true);            
    }

    const onBtnDeleteClick = (data) => {        
        setCurrentProduct(data);
        setDeleteModal(true);
    }

    useEffect(()=>{
        if (FireBaseUser && !dbUser)
            fetchApi(customerURL)
            .then(result=>{
                let customerList = result.customers;
                let tempUser = customerList.find(el=>el.uid===FireBaseUser.uid);
                if (tempUser) setDbUser(tempUser);
            })
            .catch(error=>console.log(error))

        if (dbUser) {
            fetchApi(productURL)
            .then(response => setNoPage(Math.ceil(response.count/limit)))
            .catch(err => console.log(err));

            fetchApi(productURL + "?limit=" + limit + "&page=" + page)
            .then(result=>{
                let tempProduct = result.products;
                setProductList(tempProduct);
            })
            .catch(error=>console.log(error))
        }
    }, [productList,dbUser, FireBaseUser, page])

    return(
    <Container className="mt-5">
        {
            (FireBaseUser && dbUser && dbUser.role === "Admin")
            ? 
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} className='text-center'>
                    <h2 className="fw-bold">Danh sách sản phẩm</h2>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button variant="contained" color='success' onClick={onBtnAddClick}>Thêm sản phẩm</Button>
                </Grid>            
                {
                    productList.length > 0
                    ?
                        <Grid item xs={12} md={12} sm={12} lg={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="sample table">
                                <TableHead style={ {backgroundColor: 'orange'}}>
                                    <TableRow>
                                        <TableCell width='30%'>Tên sản phẩm</TableCell>
                                        <TableCell width='20%'>Hình ảnh</TableCell>
                                        <TableCell width='15%'>Loại</TableCell>
                                        <TableCell width='15%'>Giá ưu đãi(VND)</TableCell>
                                        <TableCell width='20%'> Action </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        productList.map((item, index) => 
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>
                                                {item.name}
                                            </TableCell>
                                            <TableCell>
                                                <img src={item.imageUrl} alt='pic' width='25%'/>
                                            </TableCell>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item.promotionPrice.toLocaleString() }</TableCell>
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
                            <Pagination onChange={changeHandler} count={noPage} defaultPage={1} style={{marginTop: 15}}></Pagination>
                        </Grid>                     
                    : <h4>Chưa có sản phẩm trong hệ thống!</h4>
                }
            </Grid>
            : <h4>Bạn chưa đăng nhập, không có quyền truy cập trang này!</h4>
        }
        <InsertProductModal insert={insertModal} setInsert={setInsertModal}/>
        <UpdateProductModal update={updateModal} setUpdate={setUpdateModal} product={currentProduct}/>
        <DeleteProductModal deleteModal={deleteModal} setDelete={setDeleteModal} product={currentProduct}/>
    </Container>
    )
}

export default ProductTable;