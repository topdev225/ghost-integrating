import * as types from '../types';


export const getSettings = (uuid) => ({
  type: types.GET_SETTING,
  payload: uuid,
});

export const saveSettings = (param) => ({
  type: types.SAVE_SETTING,
  payload: param,
});

