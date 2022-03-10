import { TextField, Button, Grid, Box } from '@mui/material';
import {auth, googleProvider} from './../../firebase';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({sendUser}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const baseURL = "http://localhost:8000/customers/";
    const [user, setUser] = useState(null);
    const navigate = useNavigate();    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userExist, setUserExist] = useState(false);

    const changePasswordHandler = e => setPassword(e.target.value);
    const changeEmailHandler = e => setEmail(e.target.value);

    const createNewuser = (param) => {
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

    const loginGoogle = () => {
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            toast.success("Đăng nhập thành công! Trở lại trang chủ ...");
            setUser(result.user);     
            let newUser = {
                uid: user.providerData[0].uid,
                fullName: user.providerData[0].displayName,
                email: user.providerData[0].email,
                phoneNumber: user.providerData[0].phoneNumber,                
            }     
            
            if (!userExist) createNewuser(newUser);

            setTimeout(() => navigate('/'), 5000);
            sendUser(user);
        })
        .catch((err) => {
            console.log(err.message);
            toast.error("Lỗi rồi! " + err.message);
        })
    }    

    useEffect(()=> {
        if (user) 
            fetchApi(baseURL)
            .then((result)=>{
                let userList = result.customers;
                let temp = userList.find(el=> el.uid === user.providerData[0].uid);
                if (temp) setUserExist(true);
                else setUserExist(false);
            })
            .catch(err => console.log(err))                
    }, [user])

    const loginEmail = () => {
        auth.signInWithEmailAndPassword(email, password)
        .then((result)=> {
            toast.success("Đăng nhập thành công!");
            setUser(result.user);
            navigate('/');
            sendUser(user);
        })
        .catch(() => toast.error("Email/Password sai rồi!"))
    }

    return(
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"        
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
                    <TextField placeholder='Username' variant='outlined' label="Username" onChange={changeEmailHandler}/>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>                    
                    <TextField placeholder='Password' variant='outlined' label="Password" onChange={changePasswordHandler} type='password'/>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>
                    <Button variant='contained' color='success' style={{borderRadius: 10, margin: 20}} onClick={loginEmail}>Sign in</Button>
                </Grid>
            </Grid>
            <ToastContainer autoClose={2000}/>
        </Box>
    )
}

export default Login;