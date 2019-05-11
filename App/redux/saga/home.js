import { call, put, select } from 'redux-saga/effects';
import DeviceInfo from 'react-native-device-info';
import * as _ from 'lodash';

import NavigatorService from '../../service/navigator';
import * as types from '../types';
import * as Service from '../../service';

let destNumber = '';
// worker Saga: will be fired on USER_FETCH_REQUESTED actions
export function* fetchInboxData(action) {
  try {
    const result = yield call(Service.fetchInboxData, action.payload);
    console.log('Inbox Data', result);
    if (result.status === 'success') {
      console.log('Inbox Data', JSON.stringify(result.inbox));
      yield put({ type: types.INBOX_DATA, payload: result.inbox });
    } else {
      console.log(result.error.text);
      // Service.showToast(result.error.text);
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

export function* sendSMS(action) {
  try {
    yield put({ type: types.SET_LOADING, payload: true });
    const result = yield call(Service.sendSMS, action.payload.param);
    yield put({ type: types.SET_LOADING, payload: false });
    // alert(JSON.stringify(result));
    if (result.status === 'success') {
      yield put({ type: types.FETCH_INBOX_DATA, payload: DeviceInfo.getUniqueID() });
      NavigatorService.navigate('chat', action.payload.chatParam);
    } else {
      Service.showToast(result.error.text);
    }
  } catch (e) {
    yield put({ type: types.SET_LOADING, payload: false });
    Service.showToast(e.toString());
  }
}

export function* sendChatSMS(action) {
  try {
    const result = yield call(Service.sendSMS, action.payload);
    if (result.status === 'success') {
      yield put({ type: types.FETCH_SMS_HISTORY, payload: { number: action.payload.destination, uuid: DeviceInfo.getUniqueID() } });
    } else {
      Service.showToast(result.error.text);
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

export function* readMessage(action) {
  try {
    const result = yield call(Service.readMessage, action.payload);
    console.log('Read Message Result: ', result);
    if (result.status === 'success') {
      yield put({ type: types.FETCH_SMS_HISTORY, payload: { number: destNumber, uuid: DeviceInfo.getUniqueID() } });
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

export const getCurrentDid = (state) => state.current_did;

export function* fetchSMSHistory(action) {
  try {
    const result = yield call(Service.fetchSMSHistory, action.payload);
    yield put({ type: types.SET_LOADING, payload: false });
    destNumber = action.payload.number;
    if (result.status === 'success') {
      const currentDID = yield select(getCurrentDid);
      const smsHistory = _.filter(result.messages, (o) => o.did_id === currentDID.did_id);
      // console.log('SMS History: ', smsHistory);
      // console.log('SMS History: ', Service.combineSMSHistory(smsHistory));
      yield put({ type: types.SET_SMS_HISTORY, payload: Service.combineSMSHistory(smsHistory) });
    } else {
      yield put({ type: types.FORMAT_SMS_HISTORY });
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}

export function* getCallHistory(action) {
  try {
    const result = yield call(Service.getCallHistory, action.payload);
    if (result.error !== undefined) {
      // Service.showToast(result.error.text);
    } else {
      yield put({ type: types.CALL_HISTORY, payload: result });
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}
