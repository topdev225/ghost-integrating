import * as types from '../types';
import * as Service from '../../service';

export const login = param => ({
  type: types.LOGIN,
  payload: param,
});

export const getTrialNumber = param => ({
  type: types.GET_TRIAL_NUMBER,
  payload: param,
});

export const getAvailableNumbers = param => ({
  type: types.GET_AVAILABLE_NUMBER,
  payload: param,
});

export const setRegion = param => ({
  type: types.SET_REGION,
  payload: param,
});

export const loadTerms = () => ({
  type: types.LOAD_TERMS,
});

export const buyNumber = (number) => ({
  type: types.BUY_NUMBER,
  payload: number,
});

export const registerPlayerId = (param) => ({
  type: types.REGISTER_PLAYER_ID,
  payload: param,
});

export const sendCode = (param, callback) => dispatch => {
  Service.sendVerificationCode(param)
    .then((res) => {
      callback(res.status);
    })
    .catch((e) => console.log(e));
};

export const confirmCode = (param, callback) => dispatch => {
  Service.sendConfirmationCode(param)
    .then((res) => {
      callback(res.status);
    })
    .catch((e) => console.log(e));
};
