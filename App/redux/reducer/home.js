import createReducer from './createReducer';
import * as types from '../types';
import { defaultPerson } from '../../lib/image';

export const contacts = createReducer([], {
  [types.SET_CONTACTS](state, action) {
    return action.payload;
  },
});

export const inboxData = createReducer([], {
  [types.INBOX_DATA](state, action) {
    return action.payload;
  },
});

export const sms_to_data = createReducer({
  name: '',
  number: '',
}, {
  [types.SET_SMS_TO](state, action) {
    return action.payload;
  },
});

export const selected_photo = createReducer(defaultPerson, {
  [types.SELECTED_USER_PHOTO](state, action) {
    return action.payload;
  },
});

export const sms_history = createReducer([], {
  [types.FORMAT_SMS_HISTORY](state, action) {
    return [];
  },
  [types.SET_SMS_HISTORY](state, action) {
    return action.payload;
  },
});

export const unread_status = createReducer({}, {
  [types.SET_UNREAD_STATUS](state, action) {
    return action.payload;
  },
});

export const call_history = createReducer({}, {
  [types.CALL_HISTORY](state, action) {
    return action.payload;
  },
});

export const current_did = createReducer({ did: '', did_id: '', name: '' }, {
  [types.SET_CURRENT_DID](state, action) {
    return action.payload;
  },
});

