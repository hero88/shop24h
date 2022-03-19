import { TextField, Button, Grid, Box } from '@mui/material';
import {auth, googleProvider} from '../../../firebase';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ResetPasswordModal from '../../modal/ResetPasswordModal';

function Login({sendUser}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const baseURL = "http://localhost:8000/customers/";
    const navigate = useNavigate();  

    const [user, setUser] = useState(null);  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetPasswordModal, setResetPasswordModal] = useState(false);

    const changePasswordHandler = e => setPassword(e.target.value);
    const changeEmailHandler = e => setEmail(e.target.value);

    const createNewDBuser = (param) => {
        let reqOptions = {
            method: 'POST',
            body: JSON.stringify(param),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }      
        }
        fetchApi(baseURL, reqOptions)
        .then((result)=>{
            console.log(result);
        })
        .catch(err =>console.log(err))
    }

    const checkUserExist = paramUser => {
        fetchApi(baseURL)
        .then((result)=>{
            let customers = result.customers;
            let temp = customers.find(el=>el.uid === paramUser.providerData[0].uid);
            if (temp) return true;
            else return false;
        })
        .catch(err =>{
            console.log(err);
            return false;
        })
    }
    const loginGoogle = () => {
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            toast.success("Đăng nhập thành công!");
            let temp = result.user;
            setUser(temp);     
            let newUser = {
                uid: temp.providerData[0].uid,
                fullName: temp.providerData[0].displayName,
                email: temp.providerData[0].email,
                phoneNumber: temp.providerData[0].phoneNumber,                
            }     
            
            if (checkUserExist(temp)===false) createNewDBuser(newUser);
            localStorage.setItem('cart', []); // tạo giỏ hàng trống
            setTimeout(() => navigate('/'), 5000);
            sendUser(user);
        })
        .catch((err) => {
            console.log(err.message);
            toast.error("Lỗi rồi! " + err.message);
        })
    }    

    const loginEmail = () => {
        auth.signInWithEmailAndPassword(email, password)
        .then((result)=> {
            toast.success("Đăng nhập thành công!");
            setUser(result.user);
            localStorage.setItem('cart', []); // tạo giỏ hàng trống
            setTimeout(() => navigate('/'), 5000);
            sendUser(user);
        })
        .catch(() => toast.error("Email/Password sai rồi!"))
    }    

    const handleKeyPress = e => {
        if (e.key === 'Enter') loginEmail();
    }

    return(
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"        
            mt={5}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>
                    <Button 
                        variant='contained' 
                        color='error' 
                        style={{borderRadius: 10, margin: 20}}
                        onClick={loginGoogle}
                    >
                        Sign in with Google                    
                    </Button>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>                    
                    <p>-----OR-----</p>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>                    
                    <TextField label="Username" onChange={changeEmailHandler} />
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>                    
                    <TextField label="Password" onChange={changePasswordHandler} type='password' onKeyPress={handleKeyPress}/>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>
                    <Button variant='contained' color='success' style={{borderRadius: 10, margin: 20}} onClick={loginEmail}>Sign in</Button>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>
                    <Button onClick={()=>setResetPasswordModal(true)}>Quên mật khẩu?</Button>
                    <Button onClick={()=> navigate('/signup')}>Tạo tài khoản mới!</Button>
                </Grid>
            </Grid>
            <ResetPasswordModal resetModal={resetPasswordModal} setReset={setResetPasswordModal}/>
        </Box>
    )
}

export default Login;