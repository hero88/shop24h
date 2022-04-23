import { Modal, Box, Grid, TextField, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {useState} from 'react';
import {ModalStyle, BoxStyle} from './../../style';
import {fetchApi} from './../../api';

function UpdateProductModal({update, setUpdate, product}) {

    const handleClose = () => setUpdate(false);

    const [productName, setProductName] = useState("");
    const [type, setType] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [buyPrice, setBuyPrice] = useState(0);
    const [promotionPrice, setPromotionPrice] = useState(0);
    const [description, setDescription] = useState("");


    const changeSelectType = e => setType(e.target.value);
    const changeProductNameHandler = e => setProductName(e.target.value);
    const changeURLHandler = e => setImageURL(e.target.value.trim());
    const changeBuyPriceHandler = e => setBuyPrice(e.target.value.trim());
    const changePromotionPriceHandler = e => setPromotionPrice(e.target.value.trim());
    const changeDescriptionHandler = e => setDescription(e.target.value);

    const onBtnUpdateClick = () => {
        let vId = product._id;
        let newProduct = {
            name: productName ? productName : product.name,
            type: type ? type : product.type,
            imageUrl: imageURL ? imageURL : product.imageUrl,
            buyPrice: buyPrice ? buyPrice : product.buyPrice,
            promotionPrice: promotionPrice ? promotionPrice : product.prommotionPrice,
            description: description ? description : product.description
        };

        let reqOptions = {
            method: 'PUT',
            body: JSON.stringify(newProduct),
            headers: {'Content-type': 'application/json; charset=UTF-8'}
        };
        fetchApi('https://vast-castle-13621.herokuapp.com/products/' + vId, reqOptions)
        .then((result)=>{
            console.log(result);
            toast.success("Cập nhật sản phẩm thành công!");
            handleClose();
        })
        .catch(err=>console.log(err))
    }
    return (
        <>
        <Modal
            open={update}
            onClose={handleClose}
            aria-labelledby="modal-detail-title"
            aria-describedby="modal-detail-description"
            style={ModalStyle}
        >
            <Box sx={BoxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Thông tin sản phẩm
                </Typography>
                <Grid container spacing={2} mt={3}>
                    <Grid item xs={12}>
                        <TextField multiline maxRows={2} label='Tên sản phẩm' onChange={changeProductNameHandler} fullWidth defaultValue={product.name}/>
                    </Grid>
                    <Grid item xs={12}>
                        <label>Loại sản phẩm</label>&nbsp;
                        <select onChange={changeSelectType} defaultValue={product.type}>
                            <option value="Balo">Balo</option>
                            <option value="Display">Màn hình</option>
                            <option value="Accessories">Phụ kiện</option>
                            <option value="Keyboard">Bàn phím</option>
                            <option value="Mouse">Chuột</option>
                        </select>
                    </Grid>    
                    <Grid item xs={12}>
                        <TextField label='Link hình ảnh' onChange={changeURLHandler} fullWidth defaultValue={product.imageUrl}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type='number' label='Giá mua' onChange={changeBuyPriceHandler} fullWidth defaultValue={product.buyPrice}/>
                    </Grid>      
                    <Grid item xs={12}>
                        <TextField type='number' label='Giá ưu đãi' onChange={changePromotionPriceHandler} fullWidth defaultValue={product.promotionPrice}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField multiline maxRows={4} label='Mô tả sản phẩm' onChange={changeDescriptionHandler} fullWidth defaultValue={product.description}/>
                    </Grid>   
                </Grid>
                                           
                <Grid mt={5} container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Button variant="contained" color="success" onClick={onBtnUpdateClick}>Cập nhật sản phẩm</Button>
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

export default UpdateProductModal;