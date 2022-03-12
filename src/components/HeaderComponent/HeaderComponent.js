import { Navbar } from "reactstrap";
import { Button, MenuItem, Menu, Grid } from '@mui/material';
import {auth} from './../../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';

import Logo from "./Logo";
import IconNavBar from "./IconNavBar";
import  {connect} from  'react-redux';
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';

import {useState, useEffect} from 'react';

function HeaderComponent({currentUser}){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const [user, setUser] = useState(currentUser);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const customerURL = "http://localhost:8000/customers/";

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

    useEffect(() => {
        if (currentUser) {
            fetchApi(customerURL)
            .then(result =>{
                let customerList = result.customers;
                let tempUserProvider = customerList.find(el=>currentUser.providerData[0].uid === el.uid);
                let tempUser = customerList.find(el=> el.uid === currentUser.uid);
                if (tempUserProvider) setUser(tempUserProvider);
                if (tempUser) setUser(tempUser);
            })
            .catch(err=> console.log(err))
        }
    },[currentUser])

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
                        <MenuItem onClick={()=>navigate('/profile')}>Trang cá nhân</MenuItem>
                        <MenuItem onClick={()=>navigate('/orders')}>Đơn hàng của tôi</MenuItem>
                        {
                            (user && user.role === "Admin")
                            ? 
                            <div>
                                <MenuItem >Danh sách khách hàng</MenuItem>
                                <MenuItem >Danh sách tất cả đơn hàng</MenuItem>
                                <MenuItem onClick={()=>navigate('/producttable')} >Danh sách sản phẩm</MenuItem>
                            </div>                            
                            : <Grid></Grid>
                        }
                        
                        <MenuItem onClick={onBtnLogoutClick}>Logout</MenuItem>
                    </Menu>
                    <a href='/shoppingcart'>
                        <FontAwesomeIcon icon={faShoppingBasket}/>                       
                    </a> 
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