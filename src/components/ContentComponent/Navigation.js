import {Grid, Pagination} from '@mui/material';
import {useState, useEffect} from 'react';


function Navigation({data}) {
    const [page, setPage] = useState(1);
    const [noPage, setNoPage] = useState(0)
    const limit = 2;

    const changeHandler = (event, value) => {
        setPage(value);
    }

    useEffect(() => {
        data.slice((page - 1) * limit, page * limit);
        setNoPage(Math.ceil(data.length / limit));
    }, [data, page, limit]);

    return(
        <>        
        <Grid item xs={12} md={12} sm={12} lg={12} marginTop={5} marginBottom={5}>
            <p>Page: {page}</p>
            <Pagination onChange={changeHandler} count={noPage} defaultPage={page}></Pagination>
        </Grid>
        </>
        
    )
}

export default Navigation;