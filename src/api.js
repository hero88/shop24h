const fetchApi = async (paramUrl, paramOptions = {}) => {
    const response = await fetch(paramUrl, paramOptions);
    const responseData = await response.json();
    return responseData;
}

export {fetchApi};