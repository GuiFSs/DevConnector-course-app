import types from '../actions/types';

const initialState = {
    posts: [],
    post: {},
    loading: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.POST_LOADING:
            return {
                ...state,
                loading: true
            };
        case types.GET_POST: 
            return {
                ...state,
                post: action.payload,
                loading: false
            };
        case types.GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            }
        case types.ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };
        case types.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => (post._id !== action.payload))
            }
        default: return state;
    }
};