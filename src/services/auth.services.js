import axios from "axios";
axios.defaults.withCredentials = true;

// set token to the axios
export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

// verify refresh token to generate new access token if refresh token is present
export const verifyTokenService = async () => {
    try {
        return await axios.post(`${window.$server_url}/verifyToken`);
    } catch (err) {
        return {
            error: true,
            response: err.response
        };
    }
}

// user login API to validate the credential
export const userLoginService = async (username, password) => {
    try {
        return await axios.post(`${window.$server_url}/users/signin`, { username, password });
    } catch (err) {
        return {
            error: true,
            response: err.response
        };
    }
}

// manage user logout
export const userLogoutService = async () => {
    try {
        return await axios.post(`${window.$server_url}/users/logout`);
    } catch (err) {
        return {
            error: true,
            response: err.response
        };
    }
}