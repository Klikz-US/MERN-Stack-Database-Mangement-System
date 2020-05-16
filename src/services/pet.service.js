import axios from "axios";

export const petGetListService = async (activePage) => {
    try {
        return await axios.get(`${window.$server_url}/pets/page/${activePage}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const petGetCountService = async () => {
    try {
        return await axios.get(`${window.$server_url}/pets/count`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const petGetService = async (_id) => {
    try {
        return await axios.get(`${window.$server_url}/pets/${_id}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const petRegisterService = async (pet) => {
    try {
        return await axios.post(`${window.$server_url}/pets/add`, pet);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const petDeleteService = async (_id) => {
    try {
        return await axios.delete(`${window.$server_url}/pets/delete/${_id}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const petUpdateService = async (id, pet) => {
    try {
        return await axios.patch(
            `${window.$server_url}/pets/update/${id}`,
            pet
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};
