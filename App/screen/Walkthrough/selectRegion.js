

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import RNPickerSelect from 'react-native-picker-select';
import * as _ from 'lodash';
import { Icon } from 'native-base';

import { ActionCreators } from '../../redux/action';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Color from '../../lib/color';
import { logoTextGhostChat, topLogoWelcome, bottomLogoWelcome } from '../../lib/image';
import CustomButton from '../../component/button';
import { areaCodes } from '../../lib/area_code';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
  },
  topLogoView: {
    height: dySize(280),
    width: dySize(375),
    alignItems: 'flex-end',
    marginTop: dySize(30),
  },
  topLogo: {
    width: dySize(280),
    height: dySize(280),
    resizeMode: 'stretch',
  },
  bottomLogoView: {
    height: dySize(80),
    width: dySize(375),
    alignItems: 'flex-start',
  },
  bottomLogo: {
    height: dySize(80),
    width: dySize(188),
    resizeMode: 'stretch',
  },
  logoTextView: {
    paddingVertical: dySize(15),
  },
  logoText: {
    width: dySize(300),
    height: dySize(20),
    resizeMode: 'contain',
  },
  subtitle: {
    paddingHorizontal: dySize(30),
    color: Color.gray,
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
    textAlign: 'center',
  },
  continue: {
    color: Color.white,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
  },
  buttonView: {
    height: dySize(64),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stateView: {
    height: 50,
    marginTop: dySize(5),
    width: dySize(300),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Color.gray,
  },
  stateLabel: {
    color: Color.gray,
    fontSize: getFontSize(12),
    paddingRight: 40,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  stateText: {
    fontSize: getFontSize(16),
    color: Color.gray,
  },
  inputIcon: {
    color: Color.blue,
    fontSize: getFontSize(16),
  },
  regionText: {
    backgroundColor: 'transparent',
    color: Color.text,
  },
  icon: {
    fontSize: getFontSize(14),
    color: Color.purple,
  },
  button: {
    height: dySize(44),
    borderRadius: dySize(22),
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export class SelectRegion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: 'Oregon',
      areaCode: 'OR',
    };
  }

  componentDidMount() {

  }

  continue() {
    const { userInfo } = this.props;
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      state: this.state.areaCode,
    };
    const user = userInfo.user[0];
    if (userInfo.config.firstTimeUser && userInfo.user.did_id === null) {
      this.props.getTrialNumber(param);
    } else if (user.credits === '0' && Number(user.freeCredits) > 0) {
      this.props.getTrialNumber(param);
    } else if (user.credits > 0) {
      this.props.getAvailableNumbers(param);
      this.props.setRegion({
        state: this.state.region,
        areaCode: this.state.areaCode,
      });
    } else {
      console.log('FreeCredits: 0');
    }
  }

  render() {
    const pickerStyle = {
      inputIOS: {
        fontSize: getFontSize(16),
        padding: 15,
        backgroundColor: Color.white,
        color: Color.text,
        height: dySize(50),
      },
      underline: {
        borderTopWidth: 0,
      },
    };
    return (
      <View style={styles.container}>
        <View style={styles.topLogoView}>
          <Image source={topLogoWelcome} style={styles.topLogo} />
        </View>
        <View style={styles.logoTextView}>
          <Image source={logoTextGhostChat} style={styles.logoText} />
        </View>

        <Text style={styles.subtitle}>Select the state you'd like your new anonymous phone number to be located from</Text>
        <View style={styles.stateContainer}>
          <View style={styles.stateView}>
            <Text style={styles.stateLabel}>State</Text>
            <View style={styles.pickerContainer}>
              <View style={{ flex: 1 }}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Oregen',
                    value: 'OR',
                  }}
                  items={areaCodes}
                  onValueChange={(value) => {
                    const selectedArea = _.filter(areaCodes, (data) => data.value === value);
                    this.setState({ region: selectedArea[0].label, areaCode: value });
                  }}
                  style={pickerStyle}
                  value={this.state.areaCode}
                  hideIcon
                  underlineColorAndroid="transparent"
                />
              </View>
              <Icon name="md-arrow-forward" style={styles.icon} />
            </View>
          </View>
        </View>
        <View style={styles.buttonView}>
          <CustomButton onPress={this.continue.bind(this)} style={styles.button}>
            <Text style={styles.continue}>Continue</Text>
          </CustomButton>
        </View>
        <View style={styles.bottomLogoView}>
          <Image source={bottomLogoWelcome} style={styles.bottomLogo} />
        </View>
        <Spinner visible={this.props.isLoading} color={Color.blue} />
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  isLoading: state.isLoading,
}), mapDispatchToProps)(SelectRegion);
