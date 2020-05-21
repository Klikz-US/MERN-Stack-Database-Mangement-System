import axios from "axios";

export const userGetListService = async () => {
    try {
        return await axios.get(`${window.$server_url}/users`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const userGetService = async (_id) => {
    try {
        return await axios.get(`${window.$server_url}/users/${_id}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const userRegisterService = async (user) => {
    try {
        return await axios.post(`${window.$server_url}/users/add`, user);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const userDeleteService = async (_id) => {
    try {
        return await axios.delete(`${window.$server_url}/users/delete/${_id}`);
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};

export const userUpdateService = async (id, user) => {
    try {
        return await axios.patch(
            `${window.$server_url}/users/edit/${id}`,
            user
        );
    } catch (err) {
        return {
            error: true,
            errMsg: err.message,
        };
    }
};
