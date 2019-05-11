

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { dySize, getFontSize } from '../../lib/responsive';
import CustomHeader from '../../component/header';
import { ActionCreators } from '../../redux/action';
import { validateEmail } from '../../service';
import NavigatorService from '../../service/navigator';
import * as Color from '../../lib/color';
import * as Constants from '../../lib/constants';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    padding: dySize(20),
  },
  label: {
    marginTop: dySize(30),
    fontSize: getFontSize(12),
    color: Color.gray,
  },
  emailInput: {
    width: dySize(335),
    height: dySize(40),
    justifyContent: 'center',
    color: Color.black,
    fontSize: getFontSize(16),
    marginTop: dySize(10),
    borderBottomWidth: 1,
    borderColor: Color.gray,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  errorText: {
    textAlign: 'center',
    color: Color.red,
    fontSize: getFontSize(12),
    paddingVertical: dySize(10),
  },
  buttonView: {
    height: dySize(50),
    width: dySize(335),
    borderRadius: dySize(15),
    backgroundColor: Color.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dySize(25),
  },
  buttonText: {
    fontSize: getFontSize(18),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  statusView: {
    height: dySize(30),
    borderRadius: dySize(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: getFontSize(16),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
});

export class SupportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      online: false,
      issue: 'General Question',
      error: '',
      email: '',
      msg: '',
    };
  }

  componentDidMount() {
    this.props.getServerStatus();
  }

  checkInput = () => {
    if (!validateEmail(this.state.email)) {
      this.setState({ error: 'Email address is invalid', isError: true });
    } else if (this.state.msg.replace(/ /g, '').length === 0) {
      this.setState({ error: 'Message should not be empty', isError: true });
    } else {
      this.setState({ error: '', isError: false });
    }
  }

  onSendTicket = () => {
    if (this.state.email.length === 0) {
      this.setState({ error: 'Email is required', isError: true });
    } else if (this.state.msg.length === 0) {
      this.setState({ error: 'The message should not be empty', isError: true });
    } else if (!this.state.isError && this.state.msg.length > 0) {
      this.submitTicket();
    }
  }

  submitTicket = () => {
    this.props.setLoading(true);
    const params = {
      uuid: DeviceInfo.getUniqueID(),
      source: Platform.OS,
      version: DeviceInfo.getVersion().toString(),
      appId: Platform.OS === 'android' ? 1 : 2,
      country: 'US',
      ticketIssue: this.state.issue,
      emailAddress: this.state.email,
      message: this.state.msg,
      devicePlatform: Platform.OS,
      deviceModel: DeviceInfo.getModel(),
      DeviceVersion: DeviceInfo.getSystemVersion(),
      locale: DeviceInfo.getDeviceLocale(),
    };
    this.props.submitTicket(params);
  }

  onChange = (what, text) => {
    this.setState({
      [what]: text,
    });
    this.checkInput();
  }

  render() {
    const {
      issue, error, email, msg,
    } = this.state;
    const { server } = this.props;
    return (
      <View style={styles.container}>
        <CustomHeader
          title="SUPPORT"
          leftIcon="ios-arrow-back"
          onPressLeft={() => NavigatorService.goBack()}
        />
        <KeyboardAwareScrollView enableOnAndroid>
          <Content contentContainerStyle={styles.content}>
            <TouchableOpacity
              delayLongPress={3500}
              onLongPress={() => NavigatorService.navigate('secret')}
            >
              <View style={[styles.statusView, { backgroundColor: server === 'Operational' ? Color.green : Color.red }]}>
                <Text style={styles.statusText}>{server}</Text>
              </View>
            </TouchableOpacity>
            <Dropdown
              label="TYPE OF ISSUE"
              data={Constants.issueTypes}
              textColor={Color.black}
              itemColor={Color.gray}
              baseColor={Color.gray}
              value={issue}
              onChangeText={(value) => this.setState({ issue: value })}
            />
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              placeholder="Your email"
              onChangeText={(text) => this.onChange('email', text)}
              underlineColorAndroid="transparent"
              placeholderTextColor={Color.gray}
              style={styles.emailInput}
              value={email}
              keyboardType="email-address"
            />
            <Text style={styles.label}>MESSAGE</Text>
            <TextInput
              multiline
              numberOfLines={8}
              placeholder="Describe your problem"
              onChangeText={(text) => this.onChange('msg', text)}
              underlineColorAndroid="transparent"
              placeholderTextColor={Color.gray}
              style={[styles.emailInput, { height: dySize(150) }]}
              value={msg}
              textAlignVertical="top"
            />
            <View style={styles.bottomView}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity style={styles.buttonView} onPress={() => this.onSendTicket()}>
              <Text style={styles.buttonText}>Send Ticket</Text>
            </TouchableOpacity>
          </Content>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  server: state.server,
}), mapDispatchToProps)(SupportScreen);
