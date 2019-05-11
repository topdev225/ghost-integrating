import * as splashActions from './splash';
import * as routeActions from './route';
import * as homeActions from './home';
import * as settingActions from './settings';
import * as supportActions from './support';
import * as callActions from './call';

export const ActionCreators = Object.assign(
  {},
  splashActions,
  routeActions,
  homeActions,
  settingActions,
  supportActions,
  callActions,
);
