import * as types from '../types';

export const getServerStatus = () => ({
  type: types.GET_SERVER_STATUS,
});

export const submitTicket = (params) => ({
  type: types.SUBMIT_TICKET,
  payload: params,
});
