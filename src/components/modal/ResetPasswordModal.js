import { Modal, Box, Grid, Typography, Button, TextField} from "@mui/material";
import { toast } from 'react-toastify';
import {useState} from 'react';
import {auth} from '../../firebase';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ResetPasswordModal({resetModal, setReset}) {
    const [email, setEmail] = useState("");
    const handleClose = () => setReset(false);

    const changeEmailHandler = e => setEmail(e.target.value);

    const onBtnConfirmClick = () => {
        let mailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(mailFormat)) { // check email
            toast.error("Email sai rồi !");
            return false;
        }
        else {
            auth.sendPasswordResetEmail(email)
            .then(()=> {
                toast.success("Gửi thành công! Vui lòng kiểm tra email của bạn!");
                handleClose();
            })
            .catch(error=> toast.error(error))
        }
    }
    return(
    <>
        <Modal      
            open={resetModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Quên mật khẩu?
                </Typography>
                <Typography>Nhập email bạn dùng để đăng kí </Typography>
                <TextField label='Email' placeholder='Your Email' onChange={changeEmailHandler}/>
                <Grid mt={5}>
                    <Button variant="contained" color="success" onClick={onBtnConfirmClick}>Gửi link</Button>
                    <Button variant="contained" color="error" onClick={handleClose} style={{float:"right"}}>Hủy bỏ</Button>
                </Grid>
            </Box>                
        </Modal>

    </>
    )
}

export default ResetPasswordModal;