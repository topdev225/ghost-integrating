import { Platform, NativeModules } from 'react-native';
import { call, put } from 'redux-saga/effects';
import SplashScreen from 'react-native-splash-screen';

import * as types from '../types';
import NavigatorService from '../../service/navigator';
import * as Service from '../../service';

const PjSipModule = NativeModules.PjSipModule;


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
export function* login(action) {
  try {
    const result = yield call(Service.login, action.payload);
    console.log('Login Details', result);
    if (result.status === 'success') {
      yield put({ type: types.USER_INFO, payload: result });
      yield put({
        type: types.SET_CURRENT_DID,
        payload: {
          did: result.user[0].trialNumber,
          did_id: result.user[0].trialDID,
          name: result.user[0].trialName,
        },
      });
      SplashScreen.hide();
      console.log(result);
      const user = result.user[0];
      // PjSipModule.create(result.user[0].sipUserName, result.user[0].sipSecret);
      if (result.config.firstTimeUser) NavigatorService.navigate('step');
      else if (user.confirmed !== 'Y') NavigatorService.navigate('verify');
      else if (result.dids.length > 0 && result.dids[0].did_id !== null) {
        yield put({ type: types.SET_CURRENT_DID, payload: result.dids[0] });
        NavigatorService.navigate('inbox');
      } else if (user.isTrial === '1' && user.trialDID !== null) NavigatorService.navigate('inbox');
      else NavigatorService.navigate('select_region');
    }
  } catch (e) {
    console.log('Saga Error', e.toString());
    alert(e.toString());
  }
}

export function* registerPlayerId(action) {
  try {
    yield call(Service.login, action.payload);
  } catch (e) {
    console.log('Saga Error', e.toString());
    alert(e.toString());
  }
}

export function* getTrialNumber(action) {
  try {
    yield put({ type: types.SET_LOADING, payload: true });
    const result = yield call(Service.getTrialNumber, action.payload);
    console.log('GetTrialNumber', result);
    yield put({ type: types.SET_LOADING, payload: false });
    const param = {
      uuid: action.payload.uuid,
      source: Platform.OS,
      version: '1.0',
    };
    yield put({ type: types.LOGIN, payload: param });
    NavigatorService.navigate('home', { index: 1 });
  } catch (e) {
    console.log('Saga Error:', e.toString());
    yield put({ type: types.SET_LOADING, payload: false });
  }
}

export function* loadTerms() {
  try {
    const result = yield call(Service.loadTerms);
    console.log('Terms of Services', result);
    yield put({ type: types.SET_TERMS, payload: result.terms });
  } catch (e) {
    console.log('Saga Error:', e.toString());
    yield put({ type: types.SET_TERMS, payload: '<h2>Error occured!</h2>' });
  }
}

export function* getAvailableNumber(action) {
  try {
    yield put({ type: types.SET_LOADING, payload: true });
    const result = yield call(Service.getAvailableNumber, action.payload);
    yield put({ type: types.SET_LOADING, payload: false });
    if (result.result === undefined) {
      yield put({ type: types.SET_AVAILABLE_NUMBERS, payload: [] });
      Service.showToast('There is no available numbers in the state');
    } else {
      yield put({ type: types.SET_AVAILABLE_NUMBERS, payload: result.result });
      NavigatorService.navigate('select_number');
    }
    console.log('GetAvailableNumber', result);
  } catch (e) {
    yield put({ type: types.SET_LOADING, payload: false });
    Service.showToast(e.toString());
    console.log('Saga Error:', e.toString());
  }
}

export function* buyNumber(action) {
  try {
    yield put({ type: types.SET_LOADING, payload: true });
    const result = yield call(Service.buyNumber, action.payload);
    yield put({ type: types.SET_LOADING, payload: false });
    if (result.error !== undefined) {
      Service.showToast(result.error.text);
    } else {
      // {status: 'success'}
      NavigatorService.navigate('home');
    }
    console.log('GetAvailableNumber', result);
  } catch (e) {
    yield put({ type: types.SET_LOADING, payload: false });
    Service.showToast(e.toString());
    console.log('Saga Error:', e.toString());
  }
}

