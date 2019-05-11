import { AsyncStorage } from 'react-native';
import Permissions from 'react-native-permissions';
import * as types from '../types';
import * as Service from '../../service';


export const setContacts = (contacts) => ({
  type: types.SET_CONTACTS,
  payload: contacts,
});

export const fetchInboxData = (uuid) => ({
  type: types.FETCH_INBOX_DATA,
  payload: uuid,
});

export const sendSMS = (param) => ({
  type: types.SEND_SMS,
  payload: param,
});

export const sendChatSMS = (param) => ({
  type: types.SEND_CHAT_SMS,
  payload: param,
});

export const readMessages = (param) => ({
  type: types.READ_MESSAGES,
  payload: param,
});

export const setSelectedUserPhoto = (photoURL) => ({
  type: types.SELECTED_USER_PHOTO,
  payload: photoURL,
});

export const loadContacts = () => dispatch => {
  Service.loadContacts((contacts) => {
    dispatch(setContacts(contacts));
  });
};

export const setSMSToNumber = (param) => ({
  type: types.SET_SMS_TO,
  payload: param,
});

export const formatSMSHistory = () => ({
  type: types.FORMAT_SMS_HISTORY,
});

export const fetchSMSHistory = (param) => ({
  type: types.FETCH_SMS_HISTORY,
  payload: param,
});

export const getCallHistory = (params) => ({
  type: types.GET_CALL_HISTORY,
  payload: params,
});

export const setCurrentDID = (did) => ({
  type: types.SET_CURRENT_DID,
  payload: did,
});

export const setPermission = (category, response) => {
  switch (category) {
    case 'contacts':
      return {
        type: types.SET_CONTACT_PERMISSION,
        response,
      };
    case 'microphone':
      return {
        type: types.SET_MICROPHONE_PERMISSION,
        response,
      };
    case 'callPhone':
      return {
        type: types.SET_CALLPHONE_PERMISSION,
        response,
      };
    case 'storage':
      return {
        type: types.SET_STORAGE_PERMISSION,
        response,
      };
    default:
      return true;
  }
};

export const checkPermission = (category, callback) => (dispatch) => {
  console.log('Checking permission ', category);
  Permissions.check(category).then((response) => {
    if (response === 'authorized') {
      dispatch(setPermission(category, response));
      callback('next');
    } else {
      Permissions.request(category).then((res) => {
        if (res === 'authorized') {
          dispatch(setPermission(category, res));
          callback('next');
        } else callback('stop');
      });
    }
  });
};
