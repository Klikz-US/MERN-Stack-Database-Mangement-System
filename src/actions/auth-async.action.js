import {
    verifyTokenStarted,
    verifyUserSuccess,
    verifyTokenEnd,
    userLoginStarted,
    userLoginFailure,
    userLogout,
} from "./auth.action";

import {
    verifyTokenService,
    userLoginService,
    userLogoutService,
} from "../services/auth.service";

// handle verify token
export const verifyTokenAsync = (silentAuth = false) => async (dispatch) => {
    dispatch(verifyTokenStarted(silentAuth));

    const result = await verifyTokenService();

    if (result.error) {
        dispatch(verifyTokenEnd());
        if (result.response && [401, 403].includes(result.response.status))
            dispatch(userLogout());
        return;
    }

    if (result.status === 204) dispatch(verifyTokenEnd());
    else dispatch(verifyUserSuccess(result.data));
};

// handle user login
export const userLoginAsync = (email, password) => async (dispatch) => {
    dispatch(userLoginStarted());

    const result = await userLoginService(email, password);

    if (result.error) {
        dispatch(userLoginFailure(result.response));
        return;
    }

    dispatch(verifyUserSuccess(result.data));
};

// handle user logout
export const userLogoutAsync = () => (dispatch) => {
    dispatch(userLogout());
    userLogoutService();
};
