import {Nav, NavItem} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';

function IconNavBar() {
    return(        
            <Nav className='ml-auto' navbar>
                <NavItem className='m-2'>
                    <FontAwesomeIcon icon={faBell}/>
                </NavItem>
                <NavItem className='m-2'>
                    <a href='/login'>
                        <FontAwesomeIcon icon={faUserCircle}/>
                    </a>
                </NavItem>
                <NavItem className='m-2'>
                    <FontAwesomeIcon icon={faShoppingBasket}/>
                </NavItem>
            </Nav>        
    )
}

export default IconNavBar;