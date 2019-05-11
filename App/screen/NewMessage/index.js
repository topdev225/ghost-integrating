

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';

import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { dySize } from '../../lib/responsive';
import CustomHeader from '../../component/header';
import { chatTopBackground } from '../../lib/image';
import * as Service from '../../service';
import NavigatorService from '../../service/navigator';
import InboxContact from './contact';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
  },
  topView: {
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(100),
    }, {
      height: dySize(70),
    }),
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.lightgray,
  },
  topBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(100),
    }, {
      height: dySize(70),
    }),
    resizeMode: 'stretch',
  },
});

export class NewMessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ReadyToSend: false,
      msg: '',
      toNumber: '',
    };
  }

  onSendSMS() {
    const { userInfo } = this.props;

    this.props.setSMSToNumber({
      number: this.state.toNumber,
      name: this.state.toNumber,
    });

    this.props.setLoading(true);
    setTimeout(() => {
      const param = {
        inbox: { number: this.props.sms_to_data.number },
        labelName: this.getMatchedContactName(this.props.sms_to_data.number),
        fromContact: true,
      };
      this.props.setLoading(false);
      NavigatorService.navigate('chat', param);
    }, 1000);
  }

  getMatchedContactName(number) {
    const index = this.props.contacts.findIndex((contact) => {
      const { phoneNumbers } = contact;
      return phoneNumbers !== undefined &&
        phoneNumbers.length > 0 &&
        Service.getPhoneDigits(phoneNumbers[0].number) === number;
    });
    if (index < 0) {
      return Service.beautifyPhoneFormat(number);
    }
    const matchedContact = this.props.contacts[index];
    return Service.getContactName(matchedContact);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image style={styles.topBack} source={chatTopBackground} />
          <CustomHeader
            title="Contacts"
            leftIcon="ios-arrow-back"
            onPressLeft={() => NavigatorService.goBack()}
            backgroundColor="transparent"
          />
        </View>
        <InboxContact
          onChangeNumber={(number) => this.setState({ toNumber: number })}
          onSendSMS={() => this.onSendSMS()}
        />
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  sms_to_data: state.sms_to_data,
  contacts: state.contacts,
}), mapDispatchToProps)(NewMessageScreen);
