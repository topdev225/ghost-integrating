import React, { DeviceEventEmitter, NativeModules } from 'react-native';
import { EventEmitter } from 'events';


export default class test extends EventEmitter {
  constructor() {
    super();
    DeviceEventEmitter.addListener('onStop', this.abc.bind(this));
  }

  abc(data) {
    this.emit('onStop');
  }
}
