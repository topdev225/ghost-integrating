import createReducer from './createReducer';
import * as types from '../types';

export const server = createReducer('Getting server status...', {
  [types.SET_SERVER_STATUS](state, action) {
    return action.payload;
  },
});
