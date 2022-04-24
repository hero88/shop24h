
import { Button, MenuItem, Menu, Grid, Divider, 
        AppBar, Container, Toolbar, Box, IconButton
} from '@mui/material';
import {auth} from './../../firebase';
import MenuIcon from '@mui/icons-material/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faUserCircle, faList, faBars, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Logo from "./Logo";
import IconNavBar from "./IconNavBar";
import { useNavigate } from "react-router-dom";

import { toast } from 'react-toastify';
import {fetchApi} from './../../api';
import {useState, useEffect} from 'react';

function HeaderComponent({currentUser, numCart}){
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#1976d2',
          },
        },
    });

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
    const [anchorElNav, setAnchorElNav] = useState(null);
    const open = Boolean(anchorEl);
    const [menuSize, setMenuSize] = useState('xs');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);
    const handleCloseNavMenu = () => setAnchorElNav(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const customerURL = "https://vast-castle-13621.herokuapp.com/customers/";

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
        const controller = new AbortController();
        const signal = controller.signal; 
        if (currentUser) {
            setMenuSize('md');
            fetchApi(customerURL, {signal: signal})
                .then(result =>{  
                        let customerList = result.customers;
                        let tempUserProvider = customerList.find(el=>currentUser.providerData[0].uid === el.uid);
                        let tempUser = customerList.find(el=> el.uid === currentUser.uid);
                        if (tempUserProvider) setUser(tempUserProvider);
                        if (tempUser) setUser(tempUser);
                                       
                })
                .catch(err=> console.log(err))
        }
        else setMenuSize('xs');

        return ()=> controller.abort();
    },[currentUser, menuSize])

    return(
    <ThemeProvider theme={darkTheme}>
        <AppBar position="fixed" color='primary'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Logo/>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            { 
                                user 
                                ? 
                                <div className="text-center">
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
                        </Menu>    
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        { 
                            user 
                            ? 
                            <div className='ms-auto'>
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
                    </Box>
                </Toolbar>
            </Container>
                    
        </AppBar>
    </ThemeProvider>
        
    )
}


export default HeaderComponent;