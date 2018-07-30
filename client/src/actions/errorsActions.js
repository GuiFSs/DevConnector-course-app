import types from './types';

export const clearErrors = () => {
  return {
    type: types.CLEAR_ERRORS
  }
}