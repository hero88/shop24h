import { Navbar } from "reactstrap";
import { Button, MenuItem, Menu } from '@mui/material';
import {auth} from './../../firebase';

import Logo from "./Logo";
import IconNavBar from "./IconNavBar";

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
            alert("Logout successful!");  
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
                    <img src={currentUser.photoURL} alt='avatar'/>&nbsp;
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
                </div> 
                :   <IconNavBar/>        
            }
            
        </Navbar>
    )
}

export default HeaderComponent;