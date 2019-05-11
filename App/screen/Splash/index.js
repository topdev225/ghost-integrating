

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';

import NavigatorService from '../../service/navigator';
import { ActionCreators } from '../../redux/action';
import { Config } from '../../lib/config';
import * as Service from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {
    OneSignal.init(Config.onesignal_appID);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened.bind(this));
    OneSignal.addEventListener('ids', this.onIds.bind(this));
    OneSignal.inFocusDisplaying(0);
    OneSignal.configure();
    const permissions = {
      alert: true,
      badge: true,
      sound: true,
    };
    OneSignal.requestPermissions(permissions);
  }

  componentDidMount() {
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      source: Platform.OS,
      version: '1.0',
    };
    this.props.login(param);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened.bind(this));
    OneSignal.removeEventListener('ids', this.onIds.bind(this));
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('Notification: ', openResult.notification);
    this.goToChat(openResult.notification.payload.additionalData);
  }

  onIds(device) {
    console.log('Device info: ', device);
    // this.props.setPlayerID(device.userId);
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      source: Platform.OS,
      version: '1.0',
      playerId: device.userId,
    };
    this.props.registerPlayerId(param);
  }

  goToChat(notificationData) {
    if (notificationData === undefined) return;
    const number = notificationData.phoneNumber;
    if (number === undefined) return;
    const matched_contact = this.getMatchedContact(number);
    let labelName = number;
    if (matched_contact.result !== 'Not Found') labelName = Service.getContactName(matched_contact);
    NavigatorService.navigate('chat', { inbox: { number }, labelName, onBack: () => null });
  }

  getMatchedContact(number) {
    const index = this.props.contacts.findIndex((contact) => {
      if (contact.phoneNumbers !== undefined &&
        contact.phoneNumbers.length > 0 &&
        Service.getPhoneDigits(contact.phoneNumbers[0].number) === number) return true;
      return false;
    });
    if (index < 0) {
      return { result: 'Not Found' };
    }
    const matchedContact = this.props.contacts[index];
    return matchedContact;
  }

  render() {
    if (this.state.isNew) {
      return (
        <View style={styles.container} />
      );
    }
    return null;
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  contacts: state.contacts,
}), mapDispatchToProps)(Splash);
