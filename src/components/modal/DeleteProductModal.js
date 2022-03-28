import { Modal, Box, Grid, Typography, Button} from "@mui/material";
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    zIndex: 10,
    p: 4,
    margin: 15% 'auto'
};


function DeleteProductModal({deleteModal, setDelete, product}){
    const fetchApi = async (paramUrl, paramOptions = {}) => {
        const response = await fetch(paramUrl, paramOptions);
        const responseData = await response.json();
        return responseData;
    }
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
            <Box sx={style}>
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