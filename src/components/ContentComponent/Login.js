import { TextField, Button, Grid, Box } from '@mui/material';
import {auth, googleProvider} from './../../firebase';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login({sendUser}) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const loginGoogle = () => {
        auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log(result);
            setUser(result.user);            
            navigate('/');
            sendUser(user);
        })
        .catch((error) => {
            console.log(error)
        })
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
                    <TextField placeholder='Username' variant='outlined' label="Username"/>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>                    
                    <TextField placeholder='Password' variant='outlined' label="Password"/>
                </Grid>
                <Grid item xs={12} md={12} sm={12} lg={12} style={{textAlign:'center'}}>
                    <Button variant='contained' color='success' style={{borderRadius: 10, margin: 20}}>Sign in</Button>
                </Grid>
            </Grid>
            
        </Box>
    )
}

export default Login;