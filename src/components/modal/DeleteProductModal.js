import { Modal, Box, Grid, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';
import {BoxStyle} from './../../style';
import {fetchApi} from './../../api';

function DeleteProductModal({deleteModal, setDelete, product}){
    const handleClose = () => setDelete(false);
    const onBtnConfirmClick = () => {
        let body = { method: 'DELETE'};
        let vId = product._id;
        fetchApi("https://vast-castle-13621.herokuapp.com/products/" + vId, body)
        .then(()=>{            
            toast.success("Bạn đã xóa thành công sản phẩm mang id= " + vId);
            handleClose();
        })
        .catch((err) => {            
            toast.error("Lỗi rồi!");
            console.log(err);
        })
    }
    return(
        <>
        <Modal      
            open={deleteModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={BoxStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Confirm Xóa sản phẩm: {product.name}
                </Typography>
                <Typography>Bạn có chắc chắn muốn xóa sản phẩm này? </Typography>
                <Grid mt={5}>
                    <Button variant="contained" color="error" onClick={onBtnConfirmClick}>Xác nhận</Button>
                    <Button variant="contained" color="success" onClick={handleClose} style={{float:"right"}}>Hủy bỏ</Button>
                </Grid>
            </Box>                
        </Modal>
        </>
    )
}

export default DeleteProductModal;