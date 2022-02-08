import { Navbar } from "reactstrap";
import Logo from "../HeaderComponent/Logo";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare,  faPinterestSquare, faTwitterSquare, faYoutube } from '@fortawesome/free-brands-svg-icons';

function SocialFooter() {
    return(
        <>
            <Navbar light>
                <Logo/>
            </Navbar>
            <div>
                <FontAwesomeIcon icon={faFacebookSquare} className='m-2 w3-hover-opacity'/>                        
                <FontAwesomeIcon icon={faPinterestSquare} className='m-2 w3-hover-opacity'/>
                <FontAwesomeIcon icon={faTwitterSquare} className='m-2 w3-hover-opacity'/>      
                <FontAwesomeIcon icon={faYoutube} className='m-2 w3-hover-opacity'/>                   
            </div>
        </>
    )
}
export default SocialFooter;