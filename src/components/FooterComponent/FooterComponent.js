import {Container, Row, Col} from 'reactstrap';
import ProductFooter from './ProductFooter';
import ServiceFooter from './ServiceFooter';
import SocialFooter from './SocialFooter';
import SupportFooter from './SupportFooter';

function FooterComponent(){
    return(
        <Container className='bg-secondary p-4 mt-5' fluid>
            <Row>
                <Col >
                    <ProductFooter/>
                </Col>
                <Col>
                    <ServiceFooter/>
                </Col>
                <Col>
                    <SupportFooter/>
                </Col>
                <Col>
                    <SocialFooter/>
                </Col>
            </Row>
        </Container>
    )
}
export default FooterComponent;