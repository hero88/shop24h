import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';
import {BoxStyle} from './../../style';
import {fetchApi} from './../../api';

function UpdateOrderModal({update, setUpdate, list, data}) {

    const handleClose = () => {
        setUpdate(false);               
    };

    const productURL = "https://vast-castle-13621.herokuapp.com/products/";
    const orderURL = "https://vast-castle-13621.herokuapp.com/orders/";    
   
    const [productList, setProductList] = useState([]);
    const [status, setStatus] = useState(0);

    const changeStatusHandler = e => setStatus(e.target.value);

    const onBtnUpdateClick = () => {        
        let targetURL = orderURL + data._id;
        let reqOptions = {
            method: 'PUT',
            body: JSON.stringify({
                status: status
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        fetchApi(targetURL, reqOptions)
        .then(()=>{            
            toast.success("Cập nhật đơn hàng: " + data._id + " thành công!");                     
            handleClose();
        })
        .catch(err=>console.log(err))        
    }

    useEffect(()=>{
        let isContinued = true;
        if (productList.length===0) 
            fetchApi(productURL)
            .then((result) => {
                if (isContinued) {
                    let tempList = result.products;
                    setProductList(tempList);
                }
            })
            .catch((error) => console.log(error))

        return ()=> isContinued = false;
    }, [productList])

    return(
        <>
        <Modal
            open={update}
            onClose={handleClose}
            aria-labelledby="modal-detail-title"
            aria-describedby="modal-detail-description"
        >
            <Box sx={BoxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Thông tin đơn hàng
                </Typography>
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12}>
                        <label>Khách hàng</label>&nbsp;
                        <select className="form-control" defaultValue={data.customer} disabled>                        
                        {
                            list.map((item, index)=>
                                <option key={index} value={item._id}>{item.fullName}</option>
                            )
                        }
                        </select>
                    </Grid>    
                    <Grid item xs={12}>
                        <TextField label='Thành tiền' defaultValue={data.totalAmount} disabled/>
                    </Grid>
                    <Grid item xs={12}>
                        <label>Trạng thái</label> &nbsp;
                        <select onChange={changeStatusHandler} defaultValue={data.status}>
                            <option value={0}>Chưa thanh toán</option>
                            <option value={1}>Đã thanh toán</option>
                        </select>
                    </Grid>                                         
                </Grid>
                                           
                <Grid container spacing={2} mt={5} >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật đơn hàng</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={handleClose} >Hủy bỏ</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
        </>
    )
}

export default UpdateOrderModal;