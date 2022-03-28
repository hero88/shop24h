import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    zIndex: 10,
    p: 4,
    margin: 15% 'auto'
};

function UpdateOrderModal({update, setUpdate, list, data}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

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
            <Box sx={style}>
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
                                           
                <Grid mt={5} >
                    <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật đơn hàng</Button>
                    <Button variant="contained" color="success" onClick={handleClose} style={{float:"right"}}>Hủy bỏ</Button>
                </Grid>
            </Box>
        </Modal>
        </>
    )
}

export default UpdateOrderModal;