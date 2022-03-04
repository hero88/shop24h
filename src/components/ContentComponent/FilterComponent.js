import {Select, MenuItem, InputLabel, Button} from '@mui/material';
import {Row, Col, Input, Container} from 'reactstrap';

import {useState, useEffect} from 'react';

function FilterComponent({sendFilteredProduct}) {
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
    const [type, setType] = useState("None");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [name, setName] = useState("");
    const [allProducts, setAllProducts] = useState([]);

    const onChangeSelect = (e) => setType(e.target.value);          
    const onMaxPriceChange = (e) => setMaxPrice(e.target.value.trim());
    const onMinPriceChange = (e) => setMinPrice(e.target.value.trim());
    const onProductNameChange = (e) =>  setName(e.target.value.trim());    
    
    const onBtnFilterClick = () => {
        console.log("---Click nút filter---");
        if (type === "None" // no filter choice selected
            && (minPrice === 0) 
            && (maxPrice === 0)
            && (!name)
            )
            sendFilteredProduct(allProducts);
        else {
            let filteredProduct = allProducts;
            if (type !== "None") { // filter by product type
                filteredProduct = allProducts.filter(function (el){
                    return el.type === type;
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
                            return (el.buyPrice >= minPrice) && (el.buyPrice <= maxPrice);
                        else
                            return (el.buyPrice >= minPrice) || (el.buyPrice <= maxPrice); 
                    })
                }
            }
            if (name) { // filter by name
                filteredProduct = filteredProduct.filter(function(el){
                    return el.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
                })
            }
            console.log(filteredProduct);
            sendFilteredProduct(filteredProduct);
        }
    }
    

    useEffect(()=>{
        fetchApi("http://localhost:8000/products/")
            .then(response => {
                setAllProducts(response.products);
            })
            .catch(error => console.log(error))
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
        <Button className='mt-5' variant='contained' onClick={onBtnFilterClick}>Lọc</Button>
        </Container>
    )
}

export default FilterComponent;