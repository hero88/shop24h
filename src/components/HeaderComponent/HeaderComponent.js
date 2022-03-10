import { Navbar } from "reactstrap";
import { Button, MenuItem, Menu } from '@mui/material';
import {auth} from './../../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';

import Logo from "./Logo";
import IconNavBar from "./IconNavBar";
import  {connect} from  'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {useState} from 'react';

function HeaderComponent({currentUser}){
    const [user, setUser] = useState(currentUser);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onBtnLogoutClick = () => {
        auth.signOut()
        .then(() => {
            setUser(null);
            localStorage.setItem('cart', []);
            toast.success("Đăng xuất thành công!"); 
            console.log(user);        
            handleClose();
        })
        .catch((error) => {
            console.log(error)
        })
    }        

    return(
        <Navbar className='fixed-top' color='light' expand='md' light>
            <Logo/>
            { 
                currentUser 
                ? 
                <div>
                    <p>Hello {currentUser.displayName}</p>&nbsp;
                    <img src={currentUser.photoURL} alt='avatar' width='30%'/>&nbsp;
                    <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    >
                        Menu
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={onBtnLogoutClick}>Logout</MenuItem>
                    </Menu>
                    <a href='/shoppingcart'>
                        <FontAwesomeIcon icon={faShoppingBasket}/>                       
                    </a>
                    <ToastContainer autoClose={2000}/>   
                </div> 
                :   <IconNavBar/>        
            }        
        </Navbar>
    )
}

const mapStateToProps = state =>{
    return{
        numberCart: state._todoProduct.numberCart
    }
}

export default connect(mapStateToProps,null)(HeaderComponent);