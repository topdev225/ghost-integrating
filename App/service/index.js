import Toast from 'react-native-simple-toast';
import { eventChannel } from 'redux-saga';
import * as types from '../redux/types';


const AsYouTypeFormatter = require('google-libphonenumber').AsYouTypeFormatter;
const Contacts = require('react-native-contacts');

const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthArrayFullName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const combineSMSHistory = (smsHistory) => {
  const temp = [];
  let prevMessage = {};
  smsHistory.map((sms) => {
    if (temp.length === 0) {
      temp.push(sms);
    } else if (prevMessage.sent !== sms.sent) {
      temp.push(sms);
    } else if (Math.abs(sms.created_at - prevMessage.created_at) > 3) {
      temp.push(sms);
    } else {
      temp[temp.length - 1].message = sms.message + temp[temp.length - 1].message;
    }
    prevMessage = sms;
  });
  console.log('Combining sms history...', temp);
  return temp;
};

export const createSocketChatChannel = socket => eventChannel((emit) => {
  const handler = (data) => {
    emit(data);
  };
  socket.on('received_sms', handler);
  return () => {
    socket.off('received_sms', handler);
  };
});

export const showToast = (msg) => {
  setTimeout(() => {
    Toast.show(msg, Toast.LONG);
  }, 500);
};

export const isNumber = (val) => {
  const isnum = /^\d+$/.test(val);
  return isnum;
};

export const decodeMessage = (message) => {
  let msg = message.replace(/%F0%9F%98%84/g, '😄');
  msg = msg.replace(/%F0%9F%98%83/g, '😃');
  msg = msg.replace(/%F0%9F%98%80/g, '😀');
  msg = msg.replace(/%F0%9F%98%89/g, '😉');
  msg = msg.replace(/%F0%9F%98%8A/g, '😊');
  msg = msg.replace(/%F0%9F%98%92/g, '😒');
  msg = msg.replace(/%F0%9F%98%9B/g, '😛');
  msg = msg.replace(/%F0%9F%98%9C/g, '😜');
  msg = msg.replace(/%F0%9F%98%9E/g, '😞');
  msg = msg.replace(/%F0%9F%98%A2/g, '😢');
  msg = msg.replace(/%F0%9F%98%AD/g, '😭');
  msg = msg.replace(/%F0%/g, '');
  // let res = '';
  // let len = 0;
  // while (len < msg.length) {
  //   if (len + 12 > msg.length) res += '123';
  //   else res += decodeURIComponent(msg.substr(len, 12).replace(/\+/g, ' '));
  //   len += 12;
  // }
  return decodeURIComponent(msg.replace(/\+/g, ' '));
};

export const getContactName = (contact) => {
  const fName = contact.givenName === null ? '' : contact.givenName;
  const lName = contact.familyName === null ? '' : contact.familyName;
  return `${fName} ${lName}`;
};

export const convertParam = (param) => {
  const formBody = [];
  for (const property in param) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(param[property]);
    formBody.push(`${encodedKey}=${encodedValue}`);
  }
  return formBody.join('&');
};

export const getSimplyName = (name) => {
  const disName = name.split(' ');
  if (disName.length > 0) return disName[0].substring(0, 1).toUpperCase();
  return '';
};

export const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

export const beautifyPhoneFormat = (number) => {
  const formatter = new AsYouTypeFormatter('US');
  if (!isNumber(number)) return number;
  for (let i = 0; i < number.length; i++) {
    formatter.inputDigit(number.substring(i, i + 1));
  }
  return formatter.currentOutput_;
};

export const getPhoneDigits = (number) => {
  const str = number.match(/\d+/g).map(Number);
  const digits = String(str).replace(/\,/g, '');
  if (digits[0] === '1') return digits.substr(1);
  return digits;
};

export const convertDate = (date) => {
  const m = monthArrayFullName[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m} ${d}, ${y}`;
};

export const convertTime = (time) => {
  const CT = new Date();
  const CWeekDay = CT.getDay();
  const CDate = CT.getDate();
  const CMonth = CT.getMonth();
  const CYear = CT.getFullYear();

  const DT = new Date(time);
  const PWeekDay = DT.getDay();
  const PDate = DT.getDate();
  const PMonth = DT.getMonth();
  const PYear = DT.getFullYear();
  const hours = `0${DT.getHours() > 12 ? (DT.getHours() - 12) : DT.getHours()}`;
  const minutes = `0${DT.getMinutes()}`;
  const todayOffset = DT.getHours() * 3600 + DT.getMinutes() * 60 + DT.getSeconds();
  const AP = DT.getHours() > 11 ? 'PM' : 'AM';
  // 1427671611347
  if (PDate === CDate && PMonth === CMonth && PYear === CYear) {
    return `${hours.substr(-2)}:${minutes.substr(-2)} ${AP}`;
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 + todayOffset) {
    return 'Yesterday';
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 * CWeekDay + todayOffset) {
    return weekDayArray[PWeekDay];
  } else if (CYear > PYear) {
    return `${monthArray[PMonth]} ${PDate}, ${PYear}`;
  }
  return `${monthArray[PMonth]} ${PDate}`;
};

export const convertChatDate = (time) => {
  const CT = new Date();
  const CWeekDay = CT.getDay();
  const CDate = CT.getDate();
  const CMonth = CT.getMonth();
  const CYear = CT.getFullYear();

  const DT = new Date(time);
  const PWeekDay = DT.getDay();
  const PDate = DT.getDate();
  const PMonth = DT.getMonth();
  const PYear = DT.getFullYear();
  const todayOffset = DT.getHours() * 3600 + DT.getMinutes() * 60 + DT.getSeconds();
  // 1427671611347
  if (PDate === CDate && PMonth === CMonth && PYear === CYear) {
    return 'Today';
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 + todayOffset) {
    return 'Yesterday';
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 * CWeekDay + todayOffset) {
    return weekDayArray[PWeekDay];
  } else if (CYear > PYear) {
    return `${monthArray[PMonth]} ${PDate}, ${PYear}`;
  }
  return `${monthArray[PMonth]} ${PDate}`;
};

export const convertChatTime = (time) => {
  const DT = new Date(time);
  const hours = `0${DT.getHours() > 12 ? (DT.getHours() - 12) : DT.getHours()}`;
  const minutes = `0${DT.getMinutes()}`;
  const AP = DT.getHours() > 11 ? 'PM' : 'AM';
  return `${hours.substr(-2)}:${minutes.substr(-2)} ${AP}`;
};

export const convertCallTime = (time) => {
  const CT = new Date();
  const CWeekDay = CT.getDay();
  const CDate = CT.getDate();
  const CMonth = CT.getMonth();
  const CYear = CT.getFullYear();

  const DT = new Date(time);
  const hours = `0${DT.getHours() > 12 ? (DT.getHours() - 12) : DT.getHours()}`;
  const minutes = `0${DT.getMinutes()}`;
  const AP = DT.getHours() > 11 ? 'PM' : 'AM';
  const PWeekDay = DT.getDay();
  const PDate = DT.getDate();
  const PMonth = DT.getMonth();
  const PYear = DT.getFullYear();
  const todayOffset = DT.getHours() * 3600 + DT.getMinutes() * 60 + DT.getSeconds();
  // 1427671611347
  let dateString = '';
  if (PDate === CDate && PMonth === CMonth && PYear === CYear) {
    dateString = 'Today';
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 + todayOffset) {
    dateString = 'Yesterday';
  } else if ((CT.getTime() - DT.getTime()) / 1000 < 86400 * CWeekDay + todayOffset) {
    dateString = weekDayArray[PWeekDay];
  } else if (CYear > PYear) {
    dateString = `${monthArray[PMonth]} ${PDate}, ${PYear}`;
  } else {
    dateString = `${monthArray[PMonth]} ${PDate}`;
  }
  return `${dateString} at ${hours.substr(-2)}:${minutes.substr(-2)} ${AP}`;
};

export const APICALL = (url, param, method) =>
  fetch(
    url,
    method === 'POST' ? {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: convertParam(param),
    } : {
      method,
    },
  )
    .then(data => data.json())
    .then((res) => res)
    .catch((e) => (e.toString()));

export const login = (param) => APICALL(types.URL_LOGIN, param, 'POST');
export const sendVerificationCode = (param) => APICALL(types.URL_SEND_VERIFICATION_CODE, param, 'POST');
export const sendConfirmationCode = (param) => APICALL(types.URL_SEND_CONFIRM_CODE, param, 'POST');
export const getTrialNumber = (param) => APICALL(types.URL_GET_TRIAL_NUMBER, param, 'POST');
export const loadTerms = () => APICALL(types.URL_TERMS_OF_SERVICES, null, 'GET');
export const getAvailableNumber = (param) => APICALL(types.URL_GET_AVAILABLE_NUMBER, param, 'POST');
export const buyNumber = (param) => APICALL(types.URL_BUY_NUMBER, param, 'POST');
export const sendSMS = (param) => APICALL(types.URL_SEND_SMS, param, 'POST');
export const fetchInboxData = (uuid) => APICALL(types.URL_FETCH_INBOX, { uuid }, 'POST');
export const fetchSMSHistory = (param) => APICALL(types.URL_FETCH_INBOX, param, 'POST');
export const readMessage = (param) => APICALL(types.URL_READ_MESSAGE, param, 'POST');
export const getSetting = (uuid) => APICALL(types.URL_GET_SETTING, { uuid }, 'POST');
export const saveSetting = (param) => APICALL(types.URL_SAVE_SETTING, param, 'POST');
export const getServerStatus = () => APICALL(types.URL_GET_SERVER_STATUS, null, 'GET');
export const submitTicket = (param) => APICALL(types.URL_SUBMIT_TICKET, param, 'POST');
export const getCallHistory = (param) => APICALL(types.URL_GET_CALL_HISTORY, param, 'POST');
export const prepareCall = (param) => APICALL(types.URL_CALL, param, 'POST');

export const loadContacts = (callback) => {
  Contacts.getAll((err, contacts) => {
    if (err) throw err;
    callback(contacts);
  });
};

