import createReducer from './createReducer';
import * as types from '../types';

export const routeName = createReducer('', {
  [types.ROUTE_NAME](state, action) {
    return action.payload;
  },
});

export const drawerOpened = createReducer(false, {
  [types.SET_DRAWER_STATUS](state, action) {
    return action.payload;
  },
});
