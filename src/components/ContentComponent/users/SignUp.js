import { Grid, TextField, Button, Typography} from "@mui/material";
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import {useState} from 'react';

import {auth} from '../../../firebase';
import {useNavigate} from 'react-router-dom';

function SignUp(){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const customerURL = "http://vast-castle-13621.herokuapp.com/customers/";
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const changeFullNameHandler = e => setName(e.target.value.trim());
    const changeEmailHandler = e => setEmail(e.target.value.trim());
    const changePasswordHandler = e => setPassword(e.target.value.trim());
    const changePhoneHandler = e => setPhone(e.target.value.trim());
    const changeAddressHandler = e => setAddress(e.target.value.trim());
    const changeCityHandler = e => setCity(e.target.value.trim());
    const changeCountryHandler = e => setCountry(e.target.value.trim());

    const checkInput = param => {
        if (param.fullName.length === 0) { // check name
            toast.error("Chưa nhập họ tên !");
            return false;
        }
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!param.email.match(mailFormat)) { // check email
            toast.error("Email sai rồi !");
            return false;
        }

        if (isNaN(param.phoneNumber)) { // check phone
            toast.error("Số điện thoại không được có chữ !");
            return false;
        }
        // done checking
        return true;
    }

    const createDbUser = (paramId) => {
        let newUser = {
            uid: paramId,
            fullName: name,
            city: city,
            phoneNumber: phone,
            country: country,
            email: email
        }
        if (checkInput(newUser)) {
            let reqOptions = {
                method: 'post',
                body: JSON.stringify(newUser),
                headers: {'Content-type': 'application/json; charset=UTF-8'}
            }
            fetchApi(customerURL, reqOptions)
            .then(response =>{
                console.log(response);
                toast.success("Đăng ký thành công !");
            })
            .catch(error=>console.log(error))
        }
            
    }

    const onBtnSignUpClick = () => {
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
        if (email.match(mailFormat) && strongPassword.test(password)) {
            auth.createUserWithEmailAndPassword(email, password) // create Firebase account
            .then((data)=>{
                let user = data.user;
                createDbUser(user.uid); // create user in backend
                clearForm();
                localStorage.setItem('cart', []); // tạo giỏ hàng trống
                setTimeout(() => navigate('/'), 2000);
            })
            .catch((error) => toast.error(error.message))
            
        }
        else {
            toast.error("Email/Mật khẩu không hợp lệ!");
        }
    }

    const clearForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setAddress("");
        setCity("");
        setCountry("");
    }
    return(
    <>
        <Container className='mt-5'>
            <Grid container spacing={2}>
                    <Grid item xs={12} lg={12} sm={12} md={12} className='text-center'>
                            <h2 className="fw-bold">Đăng ký</h2>
                    </Grid>
                    <Grid item xs={12} lg={12} sm={12} md={12}>
                        <TextField style={{marginBottom: 15}} defaultValue={name} label='Họ tên' onChange={changeFullNameHandler} fullWidth required/>
                        <TextField style={{marginBottom: 15}} defaultValue={email} label='Email' onChange={changeEmailHandler} fullWidth required/>
                        <TextField  defaultValue={password} type='password' label='Password' onChange={changePasswordHandler} fullWidth required/>
                        <Typography variant="subtitle2" style={{marginBottom: 15}}>Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and is at least eight characters long.</Typography>
                        <TextField style={{marginBottom: 15}} defaultValue={phone} label='Số điện thoại' onChange={changePhoneHandler} fullWidth/>
                        <TextField style={{marginBottom: 15}} defaultValue={address} label='Địa chỉ' onChange={changeAddressHandler} fullWidth/>
                        <TextField style={{marginBottom: 15}} defaultValue={city} label='Thành phố' onChange={changeCityHandler} fullWidth/>
                        <TextField style={{marginBottom: 15}} defaultValue={country} label='Quốc gia' onChange={changeCountryHandler} fullWidth/>
                    </Grid>
                    <Grid item xs={12} mb={2}>
                            <Button variant="contained" color="success" onClick={onBtnSignUpClick}>Đăng ký</Button>
                            <Button style={{float:"right"}} variant="contained" color="success" onClick={()=>navigate('/')}>Quay về trang chủ</Button>
                    </Grid>
            </Grid>
        </Container>
    </>
    )
}

export default SignUp;