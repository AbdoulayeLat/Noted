const apiRequest = async (url='', optionsObj=null, errMess=null) => {
    try {
        const response = await fetch(url, optionsObj);
        if(!response.ok) throw Error('Please try reloading app!')
    } catch (error) {
        errMess = error.message;
    } finally {
        return errMess;
    }
}

export default apiRequest; 