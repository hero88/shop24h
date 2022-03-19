import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState} from 'react';

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

function UpdateCustomerModal({update, setUpdate, customer}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const handleClose = () => setUpdate(false);
    const [customerName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const changeCustomerNameHandler = e => setName(e.target.value.trim());
    const changeEmailHandler = e => setEmail(e.target.value.trim());
    const changePhoneHandler = e => setPhone(e.target.value.trim());
    const changeAddressHandler = e => setAddress(e.target.value.trim());
    const changeCityHandler = e => setCity(e.target.value.trim());
    const changeCountryHandler = e => setCountry(e.target.value.trim());

    const onBtnUpdateClick = () => {
        let vId = customer._id;
        let newCustomer = {
            fullName: customerName ? customerName : customer.fullName,
            city: city ? city : customer.city,
            country: country ? country : customer.country,
            phoneNumber: phone ? phone : customer.phoneNumber,
            email: email ? email : customer.email,
            address: address ? address : customer.address
        };

        if (isNaN(newCustomer.phoneNumber)) {
            toast.error("Số điện thoại không được có chữ!");
            return false;
        }
        else {
            let reqOptions = {
                method: 'PUT',
                body: JSON.stringify(newCustomer),
                headers: {'Content-type': 'application/json; charset=UTF-8'}
            };
            fetchApi('http://localhost:8000/customers/' + vId, reqOptions)
            .then((result)=>{
                console.log(result);
                toast.success("Cập nhật khách hàng thành công!");
                handleClose();
            })
            .catch(err=>console.log(err))
        }        
    }
    
    return (
        <>
        <Modal
            open={update}
            onClose={handleClose}
            aria-labelledby="modal-detail-title"
            aria-describedby="modal-detail-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Thông tin khách hàng
                </Typography>
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12}>
                        <TextField label='Tên khách hàng' onChange={changeCustomerNameHandler} fullWidth defaultValue={customer.fullName}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Email' onChange={changeEmailHandler} fullWidth defaultValue={customer.email}/>
                    </Grid>    
                    <Grid item xs={12}>
                        <TextField label='Số điện thoại' onChange={changePhoneHandler} fullWidth defaultValue={customer.phoneNumber}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Địa chỉ' onChange={changeAddressHandler} fullWidth defaultValue={customer.address}/>
                    </Grid>      
                    <Grid item xs={12}>
                        <TextField label='Thành phố' onChange={changeCityHandler} fullWidth defaultValue={customer.city}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Quốc gia' onChange={changeCountryHandler} fullWidth defaultValue={customer.country}/>
                    </Grid>   
                </Grid>
                                           
                <Grid mt={5} >
                    <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật khách hàng</Button>
                    <Button variant="contained" color="success" onClick={handleClose} style={{float:"right"}}>Hủy bỏ</Button>
                </Grid>
            </Box>
        </Modal>
        </>
    )
}

export default UpdateCustomerModal;