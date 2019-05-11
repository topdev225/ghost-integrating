import createReducer from './createReducer';
import * as types from '../types';

export const userInfo = createReducer({}, {
  [types.USER_INFO](state, action) {
    return action.payload;
  },
});

export const myRegion = createReducer({}, {
  [types.SET_REGION](state, action) {
    return action.payload;
  },
});

export const availableNumbers = createReducer([], {
  [types.SET_AVAILABLE_NUMBERS](state, action) {
    return action.payload;
  },
});

export const isLoading = createReducer(false, {
  [types.SET_LOADING](state, action) {
    return action.payload;
  },
});

export const termsHTML = createReducer('<p>Loading...</p>', {
  [types.SET_TERMS](state, action) {
    return action.payload;
  },
});

export const playerId = createReducer('', {
  [types.REGISTER_PLAYER_ID](state, action) {
    return action.payload;
  },
});

