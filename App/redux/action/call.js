import * as types from '../types';


export const prepareCall = (params) => ({
  type: types.PREPARE_CALL,
  payload: params,
});
