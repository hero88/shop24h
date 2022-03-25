import { Navbar } from "reactstrap";
import { Button, MenuItem, Menu, Grid, Divider } from '@mui/material';
import {auth} from './../../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faUserCircle, faList, faBars, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';

import Logo from "./Logo";
import IconNavBar from "./IconNavBar";
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';

import {useState, useEffect} from 'react';

function HeaderComponent({currentUser, numCart}){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }

    const cartStyle = {
        height: '1.2rem',
        width: '1.2rem',
        fontSize:'.7rem',
        borderRadius: '100%',
        background: 'green',
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'        
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

    const customerURL = "http://vast-castle-13621.herokuapp.com/customers/";

    const onBtnLogoutClick = () => {
        auth.signOut()
        .then(() => {
            setUser(null);
            localStorage.setItem('cart', []);
            toast.success("Đăng xuất thành công!"); 
            navigate('/');                  
            handleClose();
        })
        .catch((error) => {
            console.log(error)
        })
    }        

    useEffect(() => {
        let isContinued = true;
        if (currentUser) {
            fetchApi(customerURL)
                .then(result =>{
                    if (isContinued) {
                        let customerList = result.customers;
                        let tempUserProvider = customerList.find(el=>currentUser.providerData[0].uid === el.uid);
                        let tempUser = customerList.find(el=> el.uid === currentUser.uid);
                        if (tempUserProvider) setUser(tempUserProvider);
                        if (tempUser) setUser(tempUser);
                    }                    
                })
                .catch(err=> console.log(err))
        }
        
        return ()=> isContinued = false;
    },[currentUser])

    return(
        <Navbar className='fixed-top mb-5' color='warning' expand='md' light>
            <Logo/>
            { 
                user 
                ? 
                <div>
                    <p>Hello { user.role === "Admin" ? "Admin" : user.fullName}</p>&nbsp;
                    {
                        currentUser.photoURL 
                        ? <img src={currentUser.photoURL} alt='avatar' width='20%'/>
                        : <FontAwesomeIcon icon={faUserCircle}/> 
                    }
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
                        <MenuItem onClick={()=>navigate('/profile')}>
                            <FontAwesomeIcon icon={faUser}/>&nbsp;
                            Trang cá nhân
                        </MenuItem>
                        <MenuItem onClick={()=>navigate('/orders')}>
                            <FontAwesomeIcon icon={faBars}/>&nbsp;
                            Đơn hàng của tôi
                        </MenuItem>
                        {
                            (user && user.role === "Admin")
                            ? 
                            <div>
                                <MenuItem onClick={()=>navigate('/customertable')}>
                                    <FontAwesomeIcon icon={faList}/>&nbsp;
                                    Danh sách khách hàng                                
                                </MenuItem>
                                <MenuItem onClick={()=>navigate('/ordertable')}>
                                    <FontAwesomeIcon icon={faList}/>&nbsp;
                                    Danh sách tất cả đơn hàng
                                </MenuItem>
                                <MenuItem onClick={()=>navigate('/producttable')} >
                                    <FontAwesomeIcon icon={faList}/>&nbsp;
                                    Danh sách sản phẩm
                                </MenuItem>
                            </div>                            
                            : <Grid></Grid>
                        }
                        <Divider/>
                        <MenuItem onClick={onBtnLogoutClick}>
                            <FontAwesomeIcon icon={faRightFromBracket}/>&nbsp;
                            Logout
                        </MenuItem>
                    </Menu>
                    <a href='/shoppingcart' style={{marginRight: 25}}>
                        <FontAwesomeIcon icon={faShoppingBasket}/>  
                        <span style={cartStyle}>{numCart.length}</span>                     
                    </a> 
                </div> 
                :   <IconNavBar/>        
            }        
        </Navbar>
    )
}


export default HeaderComponent;