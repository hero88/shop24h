import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import {ModalStyle, BoxStyle} from './../../style'
import {fetchApi} from './../../api'

function InsertOrderModal({insert, setInsert, list}) {
    const handleClose = () => {
        setInsert(false);
        resetForm();        
    };

    const customerURL = "https://vast-castle-13621.herokuapp.com/customers/";
    const productURL = "https://vast-castle-13621.herokuapp.com/products/";
    const orderURL = "https://vast-castle-13621.herokuapp.com/orders/";
    const navigate = useNavigate();

    const [noProduct, setNoProduct] = useState(0);
    const [customerId, setCustomerId] = useState("");

    const [arrayList, setArrayList] = useState([]);
    const [productList, setProductList] = useState([]);


    const changeNoProductHandler = e => setNoProduct(e.target.value);
    const changeSelectCustomer = e => setCustomerId(e.target.value);
    
    const createArray = param => {
        let tempArr = [];
        for (let vI=0; vI<param; vI++){
            tempArr.push(vI);
        }
        setArrayList(tempArr);
    }
    
    let getProductPrice = paramId => {
        let tempProduct = productList.find(el=> el._id === paramId);
        return tempProduct.promotionPrice;
    }

    const createOrderDetail = (paramId, detail) => {
        for (let vI=0; vI < arrayList.length; vI++) {
            let item = detail[vI];
            let targetURL = orderURL + paramId + "/product/" + item.product + "/detail/";
            let reqOptions = {
                method: "POST",
                body: JSON.stringify({
                    quantity: item.quantity,
                    priceEach: item.price
                }),
                headers: {'Content-Type': 'application/json; charset=UTF-8'}
            }
            fetchApi(targetURL, reqOptions)
            .then(result=> console.log(result))
            .catch(err=> console.log(err))
        }
    }

    let totalSum = param => {
        let sum=0;
        for (let vI=0; vI< param.length; vI++){
            let temp = param[vI];
            sum += temp.quantity * temp.price;
        }
        return sum;
    }

    const onBtnInsertClick = () => {
        let details = [];
        for (let vI=0; vI<arrayList.length; vI++) {
            let inputElement = document.getElementById('quantity-input'+ vI);
            let selectElement = document.getElementById('select-product' + vI);
            let tempList = {
                product: selectElement.value,
                quantity: inputElement.value,
                price: getProductPrice(selectElement.value)
            }
            details.push(tempList);
        }
        let targetURL = customerURL + customerId + "/orders";
        let reqOptions = {
            method: 'POST',
            body: JSON.stringify({
                totalAmount: totalSum(details)
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }
        fetchApi(targetURL, reqOptions)
        .then(response=>{
            let temp = response.order;
            toast.success("Tạo đơn hàng thành công với id: " + temp._id);
            createOrderDetail(temp._id, details);            
            setTimeout(()=>navigate('/ordertable'),2000);
            handleClose();
        })
        .catch(err=>console.log(err))        
    }

    const resetForm = () => {
        setNoProduct(1);
    }

    useEffect(()=>{
        let isContinued = true;
        if (noProduct>0) createArray(noProduct);
        if (productList.length===0) 
            fetchApi(productURL)
                .then((result) => {
                    if (isContinued) {
                        let tempList = result.products;
                        setProductList(tempList);
                    }                    
                })
                .catch((error) => console.log(error))
        
        return ()=> isContinued = false;
    }, [noProduct, productList])

    return(
        <>
        <Modal
            open={insert}
            onClose={handleClose}
            aria-labelledby="modal-detail-title"
            aria-describedby="modal-detail-description"
            style={ModalStyle}
        >
            <Box sx={BoxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Thêm đơn hàng
                </Typography>
                <Grid container spacing={2} mt={3} mb={2}>
                    <Grid item xs={12}>
                        <label>Khách hàng</label>&nbsp;
                        <select onChange={changeSelectCustomer} className="form-control">                        
                        {
                            list.map((item, index)=>
                                <option key={index} value={item._id}>{item.fullName}</option>
                            )
                        }
                        </select>
                    </Grid>    
                    <Grid item xs={12}>
                        <label>Chọn số lượng sản phẩm</label> &nbsp;
                        <select onChange={changeNoProductHandler} defaultValue={1}>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                        </select>
                    </Grid>
                </Grid>
                    {                        
                        arrayList.map((el, index)=>
                            <Grid container key={index} spacing={2}>
                                <Grid item xs={6}>
                                    <select className="form-control" id={"select-product" + el}>
                                        {
                                            productList.length>0
                                            ?
                                                productList.map((item, index)=>
                                                    <option value={item._id} key={index}>{item.name}</option>
                                                )
                                            : <option></option>
                                        }
                                    </select>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField type='number' label='Số lượng' id={'quantity-input'+el} fullWidth/>
                                </Grid>                                      
                            </Grid>  
                        )                      
                    }                        
                <Grid container spacing={2} mt={5}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={onBtnInsertClick}>Thêm đơn hàng</Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={handleClose} >Hủy bỏ</Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
        </>
    )
}

export default InsertOrderModal;