import {Select, MenuItem, InputLabel, Button} from '@mui/material';
import {Row, Col, Input, Container} from 'reactstrap';

import {useState} from 'react';

function FilterComponent({sendFilterObj}) {
    const [type, setType] = useState("None");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [name, setName] = useState("");

    const onChangeSelect = (e) => setType(e.target.value);          
    const onMaxPriceChange = (e) => setMaxPrice(e.target.value.trim());
    const onMinPriceChange = (e) => setMinPrice(e.target.value.trim());
    const onProductNameChange = (e) =>  setName(e.target.value.trim());    
    
    const onBtnFilterClick = () => {
        console.log("---Click nút filter---");
        let filterObj = {
            name: name,
            minPrice: minPrice,
            maxPrice: maxPrice,
            type: type
        }
        if(isNaN(minPrice) || isNaN(maxPrice)){
            alert("Phải nhập số !");
            return false;
        }
        else
            sendFilterObj(filterObj);
    }

    return(
        <Container className='mt-5'>
        {/* Filter by type */}
        <Row>
            <Col sm='12'>
                <InputLabel id="demo-simple-select-helper-label">Chọn loại sản phẩm</InputLabel>
            </Col>
            <Col sm='12'>
                <Select 
                    labelId="demo-simple-select-helper-label"                    
                    defaultValue="None" 
                    label='Type'
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
                <Input placeholder='Min price' onChange={onMinPriceChange}/> 
            </Col>
            -
            <Col>
                <Input placeholder='Max price' onChange={onMaxPriceChange}/>
            </Col>
        </Row>
        {/* Filter by name */}
        <Row className='mt-5'>
             <Col sm='12'>
                <InputLabel>Nhập tên sản phẩm</InputLabel>
             </Col>
             <Col sm='12'>
                <Input placeholder='product name...' onChange={onProductNameChange}/> 
            </Col>
        </Row>
        <Button className='mt-5' variant='contained' onClick={onBtnFilterClick}>Tìm kiếm</Button>
        </Container>
    )
}

export default FilterComponent;