import React from 'react';
import { YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import mySaga from './redux/saga/index';
import appReducer from './redux/reducer/index';
import AppWithNav from './screen/AppWithNav';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducer, {}, applyMiddleware(thunkMiddleware, sagaMiddleware, logger));
sagaMiddleware.run(mySaga);
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.disableYellowBox = true;

export default class GhostChat extends React.Component {
  render() {
    return <Provider store={store}><AppWithNav /></Provider>;
  }
}
