
const initState = {
    admin: JSON.parse(localStorage.getItem('user')),
}

export const rootReducer = (state = initState, action) => {
    if (action.type === 'LOGIN_SUCCESS') {
        const admin = {
            ...action.admin
        }

        localStorage.setItem('user', JSON.stringify(admin));

        return {
            admin: admin,
        }
    }

    if (action.type === 'LOGOUT') {
        localStorage.removeItem('user');
        return {
            admin: null
        }
    }

    return state;
}