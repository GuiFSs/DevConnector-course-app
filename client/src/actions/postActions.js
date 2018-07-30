import axios from 'axios';
import types from './types';

export const addPost = postData => async dispatch => {
    try {
        const res = await axios.post('/api/posts', postData);
        dispatch({
            type: types.ADD_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const getPosts = (load = true) => async dispatch => {
    if (load) dispatch(setPostLoading());
    try {
        const res = await axios.get('/api/posts');
        dispatch({
            type: types.GET_POSTS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_POSTS,
            payload: null
        });
    }
};
export const getPost = (id, load = true) => async dispatch => {
    if (load) dispatch(setPostLoading());
    try {
        const res = await axios.get(`/api/posts/${id}`);
        dispatch({
            type: types.GET_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_POST,
            payload: null
        });
    }
};

const likeOrUnlike = (type, id) => async dispatch => {
    try {
        await axios.post(`/api/posts/${type}/${id}`);
        dispatch(getPosts(false));
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const addLike = id => likeOrUnlike('like', id);
export const removeLike = id => likeOrUnlike('unlike', id);

export const deletePost = id => async dispatch => {
    try {
        await axios.delete(`/api/posts/${id}`);
        dispatch({
            type: types.DELETE_POST,
            payload: id
        });
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const addComment = (postId, commentData) => async dispatch => {
    try {
        const res = await axios.post(`/api/posts/comment/${postId}`, commentData);
        dispatch({
            type: types.GET_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);
        dispatch({
            type: types.GET_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        });
    }
};

export const setPostLoading = () => {
    return {
        type: types.POST_LOADING
    };
};
