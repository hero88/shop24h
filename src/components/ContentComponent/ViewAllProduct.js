import {Button, Container, Col} from 'reactstrap';
function ViewAllProduct(){
    return (
        <Container className='p-3'>
            <Col className='text-center'>
                <Button color='dark'>View All</Button>
            </Col>            
        </Container>
    )
}

export default ViewAllProduct;