import axios from 'axios';
import types from './types';
import { logoutUser } from './authActions';

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

export const createProfile = (profileData, history) => async dispatch =>  {
    try {
        await axios.post('/api/profile', profileData);
        history.replace('/dashboard');
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        })
    }
};

const addEduOrExp = (name, data, history) => async dispatch => {
    try {
        await axios.post(`/api/profile/${name}`, data);
        history.push('/dashboard');
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
}


const deleteEduOrExp = (name, id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/${name}/${id}`);
        dispatch({
            type: types.GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const getProfiles = () => async dispatch => {
    dispatch(setProfileLoading());
    try {
        const response = await axios.get('/api/profile/all');
        dispatch({
            type: types.GET_PROFILES,
            payload: response.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_PROFILES,
            payload: null
        });
    }
}
export const getProfileByHandle = (handle) => async dispatch => {
    dispatch(setProfileLoading());
    try {
        const response = await axios.get(`/api/profile/handle/${handle}`);
        dispatch({
            type: types.GET_PROFILE,
            payload: response.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_PROFILE,
            payload: null
        });
    }
}

export const addExperience = (expData, history) => addEduOrExp('experience', expData, history);

export const addEducation = (eduData, history) => addEduOrExp('education', eduData, history);

export const deleteEducation = id => deleteEduOrExp('education', id);

export const deleteExperience = id => deleteEduOrExp('experience', id);

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {
            await axios.delete('/api/profile');
            dispatch(logoutUser());
        } catch (err) {
            dispatch({
                type: types.GET_ERRORS,
                payload: err.response.data
            });
        }
        
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