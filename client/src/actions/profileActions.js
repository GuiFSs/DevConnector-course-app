import axios from 'axios';

import types from './types';

export const getCurrentProfile = () => async dispatch => {
    dispatch(setProfileLoading());
    try {
        const response = await axios.get('/api/profile');
        dispatch({
            type: types.GET_PROFILE,
            payload: response.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_PROFILE,
            payload: {}
        });
    }
    
}

export const setProfileLoading = () => {
    return {
        type: types.PROFILE_LOADING
    }
}

export const clearCurrentProfile = () => {
    return {
        type: types.CLEAR_CURRENT_PROFILE
    }
}