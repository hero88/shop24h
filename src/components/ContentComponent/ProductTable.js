import { Grid, Paper, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import {useNavigate} from 'react-router-dom';
import InsertProductModal from "../modal/InsertProductModal";

function ProductTable() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";
    const productURL = "http://localhost:8000/products/";

    const [dbUser, setDbUser] = useState(null);
    const [productList, setProductList] = useState([]);
    const [currentProduct, setCurrentProduct] = useState({});
    const [insertModal, setInsertModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

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

        if (dbUser)
            fetchApi(productURL)
            .then(result=>{
                let tempProduct = result.products;
                setProductList(tempProduct);
            })
            .catch(error=>console.log(error))
    }, [productList,dbUser, FireBaseUser])

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
                        </Grid>
                    : <p>Chưa có sản phẩm trong hệ thống!</p>
                }
            </Grid>
            : <p>Bạn không có quyền truy cập trang này!</p>
        }
        <InsertProductModal insert={insertModal} setInsert={setInsertModal}/>
    </Container>
    )
}

export default ProductTable;