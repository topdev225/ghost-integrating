import createReducer from './createReducer';
import * as types from '../types';

export const settings = createReducer({}, {
  [types.SET_SETTING](state, action) {
    return action.payload;
  },
});
