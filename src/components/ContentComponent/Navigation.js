import {Grid, Pagination} from '@mui/material';
import {useState, useEffect} from 'react';


function Navigation({data}) {
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0)
    const limit = 2;

    const changeHandler = (event, value) => {
        setPage(value);        
    }

    useEffect(() => {
        if (data.length>0) {
            setProductList(data.slice((page - 1) * limit, page * limit));
            setNoPage(Math.ceil(data.length / limit));  
        } 
        else {
            setNoPage(1);
            setProductList([]);
        }             
    }, [data, page, limit]);

    return(
        <>        
        <Grid item xs={12} md={12} sm={12} lg={12} marginTop={5} marginBottom={5}>
            <p>Page: {page}, total Products = {productList.length}</p>
            <Pagination onChange={changeHandler} count={noPage} defaultPage={1}></Pagination>
        </Grid>
        </>
        
    )
}

export default Navigation;