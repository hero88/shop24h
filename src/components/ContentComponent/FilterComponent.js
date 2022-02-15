import {Select, MenuItem, InputLabel, Button} from '@mui/material';
import {Row, Col, Input} from 'reactstrap';

function FilterComponent() {

    const onChangeSelect = (e) => console.log(e.target.value); 

    return(
        <>
        {/* Filter by type */}
        <Row>
            <Col sm='3'>
                <InputLabel id="demo-simple-select-helper-label">Chọn Type</InputLabel>
            </Col>
            <Col sm='7'>
                <Select 
                    labelId="demo-simple-select-helper-label"                    
                    defaultValue="None" 
                    onChange={onChangeSelect}
                >
                    <MenuItem value="None">Chọn</MenuItem>
                    <MenuItem value="Accessories">Phụ kiện</MenuItem>
                    <MenuItem value="Balo">Balo</MenuItem>
                    <MenuItem value="Keyboard">Bàn phím</MenuItem>
                    <MenuItem value="Mouse">Chuột</MenuItem>
                    <MenuItem value="Display">Màn hình</MenuItem>
                </Select>
            </Col>
        </Row>
        {/* Filter by price */}
        <Row className='mt-5'>
            <Col sm='12'>
                <InputLabel>Price range</InputLabel>
            </Col>
            <Col >
                <Input placeholder='Min price'/> 
            </Col>
            -
            <Col>
                <Input placeholder='Max price'/>
            </Col>
        </Row>
        {/* Filter by name */}
        <Row className='mt-5'>
             <Col>
                <InputLabel>Nhập tên sản phẩm</InputLabel>
             </Col>
             <Col>
                <Input placeholder='product name...'/> 
            </Col>
        </Row>
        <Button className='mt-5' variant='contained'>Lọc</Button>
        </>
    )
}

export default FilterComponent;