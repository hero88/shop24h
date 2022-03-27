import { NavbarBrand } from 'reactstrap';
function Logo() {
    return(
        <NavbarBrand href='/'>
            <img src='https://img.freepik.com/free-vector/happy-shop-logo-template_57516-57.jpg' 
                alt='logo'
                width='10%'
            /> <span>EasyShop</span>
        </NavbarBrand>
    )
}

export default Logo;