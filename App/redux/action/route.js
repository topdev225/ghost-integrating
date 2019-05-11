import dismissKeyboard from 'react-native-dismiss-keyboard';
import * as types from '../types';

export const setRouteName = routeName => ({
  type: types.ROUTE_NAME,
  payload: routeName,
});

export const setDrawerOpenState = (status) => ({
  type: types.SET_DRAWER_STATUS,
  payload: status,
});

export const setLoading = (status) => ({
  type: types.SET_LOADING,
  payload: status,
});

export const setDrawerState = (status) => dispatch => {
  if (status) dismissKeyboard();
  dispatch(setDrawerOpenState(status));
};

