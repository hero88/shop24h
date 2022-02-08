import {Container} from 'reactstrap'
import CarouselSlide from './CarouselSlide';
import LatestProducts from './LatestProducts';
import ViewAllProduct from './ViewAllProduct';


function HomepageContent(){
    return(
        <Container>
            <CarouselSlide/>
            <LatestProducts/>
            <ViewAllProduct/>
        </Container>
    )
}

export default HomepageContent;