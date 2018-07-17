
const initState = {
    admin: null,
}

export const rootReducer = (state = initState, action) => {
    if (action.type === 'LOGIN_SUCCESS') {
        const admin = {
            ...action.admin
        }
        return {
            admin: admin,
        }
    }

    return state;
}