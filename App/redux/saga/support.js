import { call, put } from 'redux-saga/effects';
import * as types from '../types';
import NavigatorService from '../../service/navigator';
import * as Service from '../../service';


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
export function* getServerStatus() {
  try {
    const result = yield call(Service.getServerStatus);
    yield put({
      type: types.SET_SERVER_STATUS,
      payload: result.status['status.io'].result.status_overall.status,
    });
  } catch (e) {
    alert(e.toString());
  }
}

export function* submitTicket(action) {
  try {
    const result = yield call(Service.submitTicket, action.payload);
    yield put({ type: types.SET_LOADING, payload: false });
    if (result.error !== undefined) {
      Service.showToast(result.error.text);
    } else {
      Service.showToast('Your new support ticket has been sent. An agent will receive it shortly.');
      NavigatorService.goBack();
    }
  } catch (e) {
    alert(e.toString());
  }
}
