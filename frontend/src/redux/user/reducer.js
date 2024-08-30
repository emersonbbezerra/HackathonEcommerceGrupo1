import UserActionTypes from "./action-types"

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case UserActionTypes.LOGIN:
            localStorage.setItem('currentUser', JSON.stringify(action.payload))
            return { ...state, currentUser: action.payload }
        case UserActionTypes.LOGOUT:
            localStorage.removeItem('currentUser')
            return { ...state, currentUser: null }
        case UserActionTypes.SIGNUP:
            localStorage.setItem('currentUser', JSON.stringify(action.payload))
            return { ...state, currentUser: action.payload }
        default:
            return state
    }
}

export default userReducer
