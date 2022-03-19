import { Container} from 'reactstrap';
import {Carousel} from 'react-bootstrap';

function CarouselSlide({data}){
    return(
        <Container className='p-6'>
            <Carousel variant='dark'>
                {
                    data.map((element,index)=>
                        <Carousel.Item key={index}>
                            <a href='/products'>
                                <img
                                    className="d-block w-100"
                                    src={element.imageUrl}
                                    alt={"Slide " + index } 
                                    width='20%'                                   
                                />
                            </a>              
                        </Carousel.Item>
                    )
                }
            </Carousel>
        </Container>
    )
}

export default CarouselSlide;