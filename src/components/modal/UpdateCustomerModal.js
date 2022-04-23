import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState} from 'react';
import {ModalStyle, BoxStyle} from './../../style';
import {fetchApi} from './../../api';

function UpdateCustomerModal({update, setUpdate, customer}) {
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
            fetchApi('https://vast-castle-13621.herokuapp.com/customers/' + vId, reqOptions)
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
            style={ModalStyle}
        >
            <Box sx={BoxStyle}>
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
                                           
                <Grid container spacing={2} mt={5} >
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật khách hàng</Button>
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

export default UpdateCustomerModal;