import { call } from 'redux-saga/effects';
import NavigatorService from '../../service/navigator';
import * as Service from '../../service';

export function* prepareCall(action) {
  try {
    const result = yield call(Service.prepareCall, action.payload);
      NavigatorService.navigate('call_screen', { to: action.payload.destNumber ,status: 'outgoing' });
    if (result.status === 'success') {
      NavigatorService.navigate('call_screen', { to: action.payload.destNumber,status: 'outgoing'  });
    }
  } catch (e) {
    Service.showToast(e.toString());
  }
}
