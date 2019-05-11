import { combineReducers } from 'redux';
import * as splashReducer from './splash';
import * as routeReducer from './route';
import * as homeReducer from './home';
import * as settingReducer from './settings';
import * as supportReducer from './support';

export default combineReducers(Object.assign(
  splashReducer,
  routeReducer,
  homeReducer,
  settingReducer,
  supportReducer,
));
