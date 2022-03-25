import { Container} from 'reactstrap';
import {Carousel} from 'react-bootstrap';

function CarouselSlide({data}){
    return(
        <Container className='p-4 mt-2' style={{width: '50%'}} >
            <Carousel variant='dark'>
                {
                    data.map((element,index)=>
                        <Carousel.Item key={index}>                            
                                <img
                                    className="d-block w-100"
                                    src={element.imageUrl}
                                    alt={"Slide " + index } 
                                    width='20%'                                   
                                />                                         
                        </Carousel.Item>
                    )
                }
            </Carousel>
        </Container>
    )
}

export default CarouselSlide;