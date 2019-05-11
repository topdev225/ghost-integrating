import { takeLatest, takeEvery } from 'redux-saga/effects';
import * as types from '../types';
import * as splash_saga from './splash';
import * as home_saga from './home';
import * as setting_saga from './settings';
import * as support_saga from './support';
import * as call_saga from './call';

function* mySaga() {
  /*
    Starts fetchUser on each dispatched `USER_FETCH_REQUESTED` action.
    Allows concurrent fetches of user.
  */

  // Splash Sagas
  yield takeLatest(types.LOGIN, splash_saga.login);
  yield takeLatest(types.REGISTER_PLAYER_ID, splash_saga.registerPlayerId);
  yield takeLatest(types.GET_TRIAL_NUMBER, splash_saga.getTrialNumber);
  yield takeLatest(types.GET_AVAILABLE_NUMBER, splash_saga.getAvailableNumber);
  yield takeLatest(types.LOAD_TERMS, splash_saga.loadTerms);
  yield takeLatest(types.BUY_NUMBER, splash_saga.buyNumber);
  // yield takeLatest(types.SEND_VERIFICATION_CODE, splash_saga.sendVerificationCode);

  // Home Sagas
  yield takeLatest(types.FETCH_INBOX_DATA, home_saga.fetchInboxData);
  yield takeLatest(types.SEND_SMS, home_saga.sendSMS);
  yield takeEvery(types.SEND_CHAT_SMS, home_saga.sendChatSMS);
  yield takeLatest(types.FETCH_SMS_HISTORY, home_saga.fetchSMSHistory);
  yield takeLatest(types.READ_MESSAGES, home_saga.readMessage);
  yield takeLatest(types.GET_CALL_HISTORY, home_saga.getCallHistory);

  // Setting Sagas
  yield takeLatest(types.GET_SETTING, setting_saga.getSetting);
  yield takeLatest(types.SAVE_SETTING, setting_saga.saveSetting);

  // Support
  yield takeLatest(types.GET_SERVER_STATUS, support_saga.getServerStatus);
  yield takeLatest(types.SUBMIT_TICKET, support_saga.submitTicket);

  // Call
  yield takeLatest(types.PREPARE_CALL, call_saga.prepareCall);
  /*
      Alternatively you may use takeLatest.
      Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
      dispatched while a fetch is already pending, that pending fetch is cancelled
      and only the latest one will be run.
    */
}

export default mySaga;
