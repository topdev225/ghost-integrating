import { call, put } from 'redux-saga/effects';

import * as types from '../types';
import * as Service from '../../service';

export function* getSetting(action) {
  try {
    yield put({ type: types.SET_LOADING, payload: true });
    const result = yield call(Service.getSetting, action.payload);
    yield put({ type: types.SET_LOADING, payload: false });
    if (result.status === 'success') {
      yield put({ type: types.SET_SETTING, payload: result.settings[0] });
    } else {
      console.log(result.error.text);
      // Service.showToast(result.error.text);
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

export function* saveSetting(action) {
  try {
    const result = yield call(Service.saveSetting, action.payload);
    if (result.status === 'success') {
      Service.showToast('Saved successfully');
      yield put({ type: types.SET_SETTING, payload: action.payload });
    } else {
      Service.showToast(result.error.text);
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

