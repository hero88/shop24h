import { Container} from 'reactstrap';
import {Carousel} from 'react-bootstrap';

import DATA from './../../data.json';

function CarouselSlide(){
    return(
        <Container className='p-4'>
            <Carousel variant='dark'>
                {
                    DATA.map((element,index)=>
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-40"
                                src={element.ImageUrl}
                                alt={"Slide " + index }
                            />
                            <Carousel.Caption className='text-start'>
                                <h3>{element.Name}</h3>
                                <p>{element.Description}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    )
                }
            </Carousel>
        </Container>
    )
}

export default CarouselSlide;