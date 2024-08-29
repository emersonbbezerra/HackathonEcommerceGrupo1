import UserActionTypes from "./action-types";

export const loginUser = (payload) => ({
    type: UserActionTypes.LOGIN,
    payload
})

export const logoutUser = () => ({
    type: UserActionTypes.LOGOUT
})

export const signupUser = (payload) => ({
    type: UserActionTypes.SIGNUP,
    payload
})