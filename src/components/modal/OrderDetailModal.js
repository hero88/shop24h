import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import {useState, useEffect} from 'react';
import {ModalStyle, BoxStyle} from './../../style';
import {fetchApi} from './../../api';
function OrderDetailModal({open, setOpen, data}) {
    const handleClose = () => setOpen(false);
    const [productList, setProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [detailList, setDetailList] = useState([]);

    let findCustomerNameById = paramId => {
        let name = "";
        let customer = customerList.find(el=>el._id === paramId);
        if (customer) name = customer.fullName;
        return name;
    }

    let findProductNameById = paramDetailID => {
        let name =""; 
        let productId ="";
        let detail = detailList.find(el=>el._id === paramDetailID);
        if (detail) productId = detail.product;
        let product = productList.find(el=>el._id === productId);
        if (product) name = product.name;
        return name;
    }

    let findQuantityById = paramDetailID => {
        let quantity = 0;
        let detail = detailList.find(el=>el._id === paramDetailID);
        if (detail) quantity = detail.quantity;
        return quantity;
    }

    useEffect(()=>{        
        if (productList.length===0) 
            fetchApi("https://vast-castle-13621.herokuapp.com/products/")
            .then(res=> {
                setProductList(res.products);
            })
            .catch(error=>console.log(error))
        if (customerList.length===0)
            fetchApi("https://vast-castle-13621.herokuapp.com/customers/")
                .then(res=> {
                    setCustomerList(res.customers);
                })
                .catch(error=>console.log(error))
        if (customerList.length===0)
            fetchApi("https://vast-castle-13621.herokuapp.com/orderdetail/")
                .then(res=> {
                    setDetailList(res.OrderDetail);
                })
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
                style={ModalStyle}
            >
                <Box sx={BoxStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Th??ng tin ????n h??ng
                    </Typography>
                    <Grid container spacing={2} mt={2}>
                        <Grid item xs={12}>
                            <TextField label='M?? kh??ch h??ng' defaultValue={findCustomerNameById(data.customer)} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>    
                        <Grid item xs={12}>
                            <TextField label='Ng??y t???o' defaultValue={new Date(data.timeCreated).toLocaleDateString()} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>
                    </Grid>
                        {
                            (data.details && data.details.length > 0)
                            ? 
                                data.details.map((item, index)=>
                                <Grid container spacing={2} key={index} mt={1}>
                                    <Grid item xs={6}>
                                        <TextField label='T??n s???n ph???m' defaultValue={findProductNameById(item)} InputProps={{readOnly: true}} fullWidth/>                                        
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label='S??? l?????ng' defaultValue={findQuantityById(item)} InputProps={{readOnly: true}} fullWidth/> 
                                    </Grid>
                                </Grid>                                    
                                )
                            : <Grid></Grid>
                        }   
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <TextField label='Tr???ng th??i' defaultValue={data.status === 0 ? 'Ch??a thanh to??n' : '???? thanh to??n'} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Th??nh ti???n(VND)' defaultValue={data.totalAmount} fullWidth InputProps={{readOnly: true}}/>
                        </Grid>   
                    </Grid>
                                            
                    <Grid mt={4} >
                        <Button variant="contained" color="success" onClick={handleClose} style={{float:"right"}}>Quay l???i</Button>
                    </Grid>
                </Box>
            </Modal>
            : <Grid></Grid>
        }        
        </>
    )
}

export default OrderDetailModal;