import { Container} from 'reactstrap';
import {Carousel} from 'react-bootstrap';

function CarouselSlide({data}){
    const getDiscount = (oldP, newP) => {
        let value = 100 * (oldP - newP) / oldP;
        return parseInt(value);
    }
    return(
        <Container className='p-4 mt-2' style={{width: '60%'}} >
            <Carousel variant='dark'>
                {
                    data.map((element,index)=>
                        <Carousel.Item key={index}>                            
                                <img
                                    className="d-block w-100"
                                    src={element.imageUrl}
                                    alt={"Slide " + index }                                  
                                />
                            <Carousel.Caption>
                                <h3 className='text-danger'>Khuyến mãi {getDiscount(element.buyPrice, element.promotionPrice)}%</h3>
                            </Carousel.Caption>                                        
                        </Carousel.Item>
                    )
                }
            </Carousel>
        </Container>
    )
}

export default CarouselSlide;