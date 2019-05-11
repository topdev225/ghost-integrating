

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';
import CheckBox from 'react-native-check-box';

import NavigatorService from '../../service/navigator';
import { ActionCreators } from '../../redux/action';
import { dySize, getFontSize, CURRENT_HEIGHT, CURRENT_WIDTH } from '../../lib/responsive';
import * as Color from '../../lib/color';
import { ghostIcon, contactBackground } from '../../lib/image';
import { beautifyPhoneFormat } from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: CURRENT_WIDTH,
    height: CURRENT_HEIGHT,
    position: 'absolute',
    resizeMode: 'stretch',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...ifIphoneX({
      paddingTop: dySize(45),
    }, {
      paddingTop: dySize(15),
    }),
    paddingHorizontal: dySize(15),
  },
  headerIcon: {
    fontSize: getFontSize(20),
    color: Color.white,
    padding: dySize(10),
  },
  headerLogo: {
    width: dySize(30),
    height: dySize(30),
    resizeMode: 'stretch',
  },
  bottomLogo: {
    height: dySize(71),
    width: dySize(375),
    resizeMode: 'stretch',
  },
  title: {
    fontSize: getFontSize(20),
    color: Color.white,
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-Regular',
  },
  ghostNumber: {
    fontSize: getFontSize(16),
    color: Color.darkPurple,
    textAlign: 'center',
    fontFamily: 'TitilliumWeb-Regular',
  },
  callNumber: {
    fontSize: getFontSize(40),
    color: Color.yellow,
    textAlign: 'center',
    fontFamily: 'D-DIN-Bold',
    marginVertical: dySize(30),
    height: dySize(40),
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dySize(-30),
  },
  buttonLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dySize(8),
  },
  buttonContainer: {
    marginHorizontal: dySize(25),
    width: dySize(60),
    height: dySize(60),
    borderRadius: dySize(30),
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Color.white,
    fontSize: getFontSize(20),
    fontFamily: 'TitilliumWeb-Regular',
  },
  buttonIconContainer: {
    marginHorizontal: dySize(25),
    width: dySize(60),
    height: dySize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: getFontSize(40),
    color: Color.white,
  },
  checkBoxText: {
    flex: 0,
    color: 'white',
    fontSize: getFontSize(20),
    fontFamily: 'TitilliumWeb-Regular',
  },
});

export class GhostCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callNumber: '',
    };
  }

  componentDidMount() {
    if (this.props.navigation.state.params !== undefined) {
      this.setState({ callNumber: this.props.navigation.state.params.number });
    }
  }

  onPressButton = (str) => {
    const temp = this.state.callNumber;
    if (temp.length > 12) return;
    this.setState({ callNumber: temp + str });
  }

  onPressBack = () => {
    const temp = this.state.callNumber;
    this.setState({ callNumber: temp.substring(0, temp.length - 1) });
  }

  onPressCall = () => {
    const { userInfo: { user }, current_did } = this.props;
    const params = {
      userId: user[0].id,
      uuid: DeviceInfo.getUniqueID(),
      source: Platform.OS,
      version: DeviceInfo.getVersion(),
      appId: Platform.OS === 'android' ? 1 : 2,
      destNumber: this.state.callNumber,
      did_id: current_did.did_id,
      changeVoice: 'none',
      country: 'US',
    };
    console.log(JSON.stringify(params));
    this.props.checkPermission('microphone', (res) => {
      if (res === 'next' || 1) {
        this.props.prepareCall(params);
      }
    });

    // NavigatorService.navigate('call_screen', { to: this.state.callNumber });
  }

  render() {
    const { callNumber } = this.state;
    const { userInfo: { user } } = this.props;
    return (
      <View style={styles.container}>
        <Image source={contactBackground} style={styles.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => NavigatorService.goBack()}>
            <Icon name="ios-arrow-back" style={styles.headerIcon} />
          </TouchableOpacity>
          <Image source={ghostIcon} style={styles.headerLogo} />
          <View style={{ width: dySize(40) }} />
        </View>
        <View>
          <Text style={styles.callNumber}>{beautifyPhoneFormat(callNumber)}</Text>
        </View>
        <View style={styles.buttonView}>
          <View style={styles.buttonLine}>
            <TouchableOpacity onPress={() => this.onPressButton('1')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('2')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('3')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonLine}>
            <TouchableOpacity onPress={() => this.onPressButton('4')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('5')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('6')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>6</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonLine}>
            <TouchableOpacity onPress={() => this.onPressButton('7')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('8')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('9')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>9</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonLine}>
            <TouchableOpacity onPress={() => this.onPressButton('*')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>*</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('0')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressButton('#')} style={styles.buttonContainer}>
              <Text style={styles.buttonText}>#</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonLine}>
            <View style={styles.buttonIconContainer} />
            <TouchableOpacity onPress={() => this.onPressCall()} style={styles.buttonIconContainer}>
              <Icon name="md-call" style={styles.buttonIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressBack()} style={styles.buttonIconContainer}>
              <Icon name="md-backspace" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  current_did: state.current_did,
}), mapDispatchToProps)(GhostCallScreen);
