import axios from "axios";

export const searchService = async (req) => {
    try {
        return await axios.post(`${window.$server_url}/search`, req);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};
