import { Navbar } from "reactstrap";

import Logo from "./Logo";
import IconNavBar from "./IconNavBar";

function HeaderComponent(){
    return(
        <Navbar className='fixed-top' color='light' expand='md' light>
            <Logo/>
            <IconNavBar/>
        </Navbar>
    )
}

export default HeaderComponent;