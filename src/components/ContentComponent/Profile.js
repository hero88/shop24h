import { Grid, TextField, Button} from "@mui/material";
import { Container } from 'reactstrap';
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';

import {auth} from '../../firebase';
import {useNavigate} from 'react-router-dom';

function Profile() {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const FireBaseUser = auth.currentUser;
    const customerURL = "http://localhost:8000/customers/";
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [name, setName] = useState(user ? user.fullName : "");
    const [email, setEmail] = useState(user ? user.email : "");
    const [phone, setPhone] = useState(user ? user.phoneNumber : "");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");

    const changeFullNameHandler = e => setName(e.target.value.trim());
    const changeEmailHandler = e => setEmail(e.target.value.trim());
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

    const onBtnUpdateClick = () => {
        let dataToUpdate = {
            fullName: name ? name : user.fullName,
            address: address ? address : user.address,
            email: email ? email : user.email,
            phoneNumber: phone ? phone : user.phoneNumber,
            city: city ? city : user.city,
            country: country ? country : user.country
        }
        if (checkInput(dataToUpdate)) {
            let reqOptions = {
                method: 'PUT', 
                headers: {"Content-Type": "application/json; charset=UTF-8"},
                body: JSON.stringify(dataToUpdate)
            };
            
            fetchApi(customerURL + user._id, reqOptions)
            .then(()=> toast.success("Cập nhật thành công !"))
            .catch(err => toast.error("Đã xảy ra lỗi: " + err.error))
        }
    }

    useEffect(() => {
        if (!user)
        fetchApi(customerURL)
            .then(result =>{
                let customerList = result.customers;
                let tempUserProvider = customerList.find(el=>FireBaseUser.providerData[0].uid === el.uid);
                let tempUser = customerList.find(el=> el._id === FireBaseUser._id);
                if (tempUserProvider) setUser(tempUserProvider);
                if (tempUser) setUser(tempUser);
            })
            .catch(err=> console.log(err))
    }, [user, FireBaseUser, name, address, email, phone, city, country])
    return(
        <div>   
            { 
                user 
                ?
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12} lg={12} sm={12} md={12} className='text-center'>
                            <h2 className="fw-bold">Thông tin cá nhân</h2>
                        </Grid>
                        <Grid item xs={4}>
                            <img src={FireBaseUser.providerData[0].photoURL} alt='pic' width='50%'></img>
                        </Grid>
                        <Grid item xs={8} >
                            <TextField style={{marginBottom: 15}} defaultValue={user.fullName} label='Họ tên' onChange={changeFullNameHandler} fullWidth/>
                            <TextField style={{marginBottom: 15}} defaultValue={user.email} label='Email' onChange={changeEmailHandler} fullWidth/>
                            <TextField style={{marginBottom: 15}} defaultValue={user.phoneNumber} label='Số điện thoại' onChange={changePhoneHandler} fullWidth/>
                            <TextField style={{marginBottom: 15}} defaultValue={user.address} label='Địa chỉ' onChange={changeAddressHandler} fullWidth/>
                            <TextField style={{marginBottom: 15}} defaultValue={user.city} label='Thành phố' onChange={changeCityHandler} fullWidth/>
                            <TextField style={{marginBottom: 15}} defaultValue={user.country} label='Quốc gia' onChange={changeCountryHandler} fullWidth/>
                        </Grid>
                        <Grid item xs={12} mb={2}>
                            <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật</Button>
                            <Button style={{float:"right"}} variant="contained" color="success" onClick={()=>navigate('/')}>Quay về trang chủ</Button>
                        </Grid>
                    </Grid>
                </Container>
                : <p>Bạn chưa đăng nhập</p>
            }
        </div>
    )
}
export default Profile;