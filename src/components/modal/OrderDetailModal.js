import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import {useState, useEffect} from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function OrderDetailModal({open, setOpen, data}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const handleClose = () => setOpen(false);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [detailList, setDetailList] = useState([]);

    let findCustomerNameById = paramId => {
        let name = "";
        let customer = customerList.find(el=>el._id = paramId);
        name = customer.fullName;
        return name;
    }

    let findProductNameById = paramDetailID => {
        let name ="";
        let detail = detailList.find(el=>el._id === paramDetailID);
        let productId = detail.product;
        let product = productList.find(el=>el._id === productId);
        name = product.name;
        return name;
    }

    let findQuantityById = paramDetailID => {
        let quantity = 0;
        let detail = detailList.find(el=>el._id === paramDetailID);
        quantity = detail.quantity;
        return quantity;
    }

    useEffect(()=>{
        if (productList.length===0) 
            fetchApi("http://localhost:8000/products/")
            .then(res=> setProductList(res.products))
            .catch(error=>console.log(error))
        if (customerList.length===0)
            fetchApi("http://localhost:8000/customers/")
            .then(res=> setCustomerList(res.customers))
            .catch(error=>console.log(error))
        if (customerList.length===0)
            fetchApi("http://localhost:8000/orderdetail/")
            .then(res=> setDetailList(res.OrderDetail))
            .catch(error=>console.log(error))
    })

    return(
        <>
        {
            data
            ?
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-detail-title"
                aria-describedby="modal-detail-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Thông tin đơn hàng
                    </Typography>
                    <Grid container spacing={2} mt={3} mb={3}>
                        <Grid item xs={12}>
                            <TextField label='Mã khách hàng' defaultValue={findCustomerNameById(data.customer)} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>    
                        <Grid item xs={12}>
                            <TextField label='Ngày tạo' defaultValue={new Date(data.timeCreated).toLocaleDateString()} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>
                    </Grid>
                        {
                            data.details.length > 0
                            ? 
                                data.details.map((item, index)=>
                                <Grid container spacing={2} key={index}>
                                    <Grid item xs={12}>
                                        <TextField multiline label='Tên sản phẩm' defaultValue={findProductNameById(item)} InputProps={{readOnly: true}} fullWidth/>                                        
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label='Số lượng' defaultValue={findQuantityById(item)} InputProps={{readOnly: true}} fullWidth/> 
                                    </Grid>
                                </Grid>                                    
                                )
                            : <Grid></Grid>
                        }   
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <TextField label='Trạng thái' defaultValue={data.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Thành tiền(VND)' defaultValue={data.totalAmount} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>   
                    </Grid>
                                            
                    <Grid mt={5} >
                        <Button variant="contained" color="success" onClick={handleClose} style={{float:"right"}}>Quay lại</Button>
                    </Grid>
                </Box>
            </Modal>
            : <Grid></Grid>
        }
        
        </>
    )
}

export default OrderDetailModal;