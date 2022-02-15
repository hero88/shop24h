import {Select, MenuItem, InputLabel, Button} from '@mui/material';
import {Row, Col, Input, Container} from 'reactstrap';

import {useState, useEffect} from 'react';
import AllProducts from './../../data.json';

function FilterComponent({sendFilteredProduct}) {
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
        if (type === "None" 
            && (minPrice === 0) 
            && (maxPrice === 0)
            && (!name)
            )
            sendFilteredProduct(AllProducts);
        else {
            let filteredProduct = AllProducts;
            if (type !== "None") { // filter by product type
                filteredProduct = AllProducts.filter(function (el){
                    return el.Type === type;
                })
            }
            if (minPrice || maxPrice) { // filter by min,max price
                if (isNaN(minPrice) || isNaN(maxPrice)) {
                    alert("Phải nhập số !");
                    return false;
                }
                else {
                    filteredProduct = filteredProduct.filter(function(el){
                        if (minPrice && maxPrice)
                            return (el.Price >= minPrice) && (el.Price <= maxPrice);
                        else
                            return (el.Price >= minPrice) || (el.Price <= maxPrice); 
                    })
                }
            }
            if (name) { // filter by name
                filteredProduct = filteredProduct.filter(function(el){
                    return el.Name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
                })
            }
            console.log(filteredProduct);
            sendFilteredProduct(filteredProduct);
        }
    }
    

    useEffect(()=>{
        console.log("Type = " + type);
        console.log("Max price = " + maxPrice);     
        console.log("Min price = " + minPrice);
        console.log("Product name = " + name);
    }, [type, minPrice, maxPrice, name]);

    return(
        <Container className='mt-5'>
        {/* Filter by type */}
        <Row>
            <Col sm='4'>
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
                <Input placeholder='Min price' onChange={onMinPriceChange}/> 
            </Col>
            -
            <Col>
                <Input placeholder='Max price' onChange={onMaxPriceChange}/>
            </Col>
        </Row>
        {/* Filter by name */}
        <Row className='mt-5'>
             <Col>
                <InputLabel>Nhập tên sản phẩm</InputLabel>
             </Col>
             <Col>
                <Input placeholder='product name...' onChange={onProductNameChange}/> 
            </Col>
        </Row>
        <Button className='mt-5' variant='contained' onClick={onBtnFilterClick}>Lọc</Button>
        </Container>
    )
}

export default FilterComponent;