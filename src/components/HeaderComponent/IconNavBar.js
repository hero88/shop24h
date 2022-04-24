
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faShoppingBasket  } from '@fortawesome/free-solid-svg-icons';

function IconNavBar() {
    return(        
            <div className='ms-auto'>
                <span className='m-2'>
                    <FontAwesomeIcon icon={faBell}/>
                </span>
                <span className='m-2'>
                    <a href='/login' data-toggle='tooltip' title='Signin here'>
                        <FontAwesomeIcon icon={faUserCircle}/>
                    </a>
                </span>
                <span className='m-2'>
                    <FontAwesomeIcon icon={faShoppingBasket}/>
                </span>
            </div>        
    )
}

export default IconNavBar;