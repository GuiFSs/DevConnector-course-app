import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import types from './types';


export const registerUser = (userData, history) => async dispatch => {
    try {
        const response = await axios.post('/api/users/register', userData);
        dispatch({
            type: 'teste',
            payload: response
        });
        history.push('/login');
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};


// Login - Get User Token
export const loginUser = userData => async dispatch => {
    try {
        const response = await axios.post('/api/users/login', userData);
        const { token } = response.data;
        localStorage.setItem('jwtToken', token);
        // set token to Auth header
        setAuthToken(token);
        // decode token to get user data - npm i jwt-decode
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: types.SET_CURRENT_USER,
        payload: decoded
    }
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem('jwtToken');
    // remove auth header
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}