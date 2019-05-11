

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import { beautifyPhoneFormat } from '../../service';
import * as Color from '../../lib/color';
import CustomSwitch from '../../component/switch';
import * as Contants from '../../lib/constants';
import {
  contactBackground,
  ghostIcon,
  settingBubble,
  settingCall,
} from '../../lib/image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  bottomLogo: {
    height: dySize(71),
    width: dySize(375),
    resizeMode: 'stretch',
  },
  content: {
    flex: 1,
    backgroundColor: Color.white,
  },
  numberView: {
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(250),
    }, {
      height: dySize(200),
    }),
    position: 'relative',
    alignItems: 'center',
  },
  numberBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(250),
    }, {
      height: dySize(200),
    }),
    resizeMode: 'stretch',
  },
  ghostIconView: {
    padding: dySize(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: dySize(5),
  },
  ghostIcon: {
    width: dySize(35),
    height: dySize(35),
    resizeMode: 'stretch',
  },
  ghostIconText: {
    paddingHorizontal: dySize(20),
    fontSize: getFontSize(20),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  ghostNumberText: {
    fontSize: getFontSize(18),
    color: Color.yellow,
    fontFamily: 'TitilliumWeb-Bold',
  },
  callIcon: {
    width: dySize(22),
    height: dySize(22),
    resizeMode: 'stretch',
  },
  limitText: {
    paddingLeft: dySize(5),
    paddingRight: dySize(15),
    color: Color.white,
    fontSize: getFontSize(12),
  },
  settingView: {
    flex: 1,
    paddingHorizontal: dySize(25),
    backgroundColor: Color.white,
  },
  coreText: {
    paddingVertical: dySize(10),
    fontSize: getFontSize(16),
    color: Color.black,
  },
  iconSettingView: {
    flexDirection: 'row',
  },
  settingIconWrapper: {
    width: dySize(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  disturbIconView: {
    width: dySize(50),
    height: dySize(50),
    borderRadius: dySize(25),
    backgroundColor: Color.lightgray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dySize(10),
  },
  disabledIcon: {
    fontSize: getFontSize(16),
    color: Color.gray,
  },
  enabledIcon: {
    fontSize: getFontSize(16),
    color: Color.purple,
  },
  settingTextView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Color.gray,
  },
  settingDescription: {
    fontSize: getFontSize(14),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
    lineHeight: dySize(20),
    paddingTop: dySize(5),
  },
  settingOption: {
    fontSize: getFontSize(16),
    color: Color.black,
  },
  inboundTextView: {
    padding: dySize(5),
    borderRadius: 4,
    borderWidth: 1,
  },
  inboundText: {
    fontSize: getFontSize(16),
  },
});

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        dnd: '0',
        notifications: '1',
        rings: '1',
        ghostcallerid: '1',
      },
      changed: false,
    };
  }

  componentWillMount() {
    this.props.getSettings(DeviceInfo.getUniqueID());
  }

  componentWillReceiveProps(props) {
    this.setState({ settings: props.settings });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   this.onPressSave();
  // }

  onPressSave = () => {
    this.props.saveSettings({
      ...this.state.settings,
      uuid: DeviceInfo.getUniqueID(),
    });
  }

  onChangeDND = (dnd) => {
    this.setState({
      settings: {
        ...this.state.settings,
        dnd: dnd === '1' ? '0' : '1',
      },
    }, () => {
      this.onPressSave();
    });
  }

  onChangeNotification = (value) => {
    this.setState({
      settings: {
        ...this.state.settings,
        notifications: value ? '1' : '0',
      },
    }, () => {
      this.onPressSave();
    });
  }

  onChangeRings = (value) => {
    this.setState({
      settings: {
        ...this.state.settings,
        rings: value ? '1' : '0',
      },
    }, () => {
      this.onPressSave();
    });
  }

  onChangeCaller = (value) => {
    this.setState({
      settings: {
        ...this.state.settings,
        ghostcallerid: value ? '0' : '1',
      },
    }, () => {
      this.onPressSave();
    });
  }

  render() {
    const {
      settings: {
        dnd, notifications, rings, ghostcallerid,
      },
    } = this.state;
    const { current_did } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.numberView}>
          <Image source={contactBackground} style={styles.numberBack} />
          <CustomHeader
            title="Settings"
            leftIcon="ios-arrow-back"
            onPressLeft={() => NavigatorService.goBack()}
            backgroundColor="transparent"
          />
          <View style={styles.ghostIconView}>
            <Image source={ghostIcon} style={styles.ghostIcon} />
            <Text style={styles.ghostIconText}>My New Ghost</Text>
          </View>
          <Text style={styles.ghostNumberText}>{beautifyPhoneFormat(current_did.did)}</Text>
          <View style={styles.ghostIconView}>
            <Image source={settingCall} style={styles.callIcon} />
            <Text style={styles.limitText}>Unlimited</Text>
            <Image source={settingBubble} style={styles.callIcon} />
            <Text style={styles.limitText}>Unlimited</Text>
          </View>
        </View>
        <View style={styles.content}>
          { !this.props.isLoading &&
            <View style={styles.settingView}>
              <Text style={styles.coreText}>CORE SETTINGS</Text>
              <TouchableOpacity
                onPress={() => this.onChangeDND(dnd)}
                style={[styles.iconSettingView, { flex: 3 }]}
              >
                <View style={styles.settingIconWrapper}>
                  <View style={styles.disturbIconView}>
                    { dnd === '1' && <Icon type="Foundation" name="volume-strike" style={styles.disabledIcon} /> }
                    { dnd === '0' && <Icon type="Foundation" name="volume" style={styles.enabledIcon} /> }
                  </View>
                </View>
                <View style={styles.settingTextView}>
                  <Text style={styles.settingDescription}>{dnd ? Contants.disturbDes : Contants.donotdisturbDes}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onChangeNotification(notifications === '0')}
                style={[styles.iconSettingView, { flex: 2 }]}
              >
                <View style={styles.settingIconWrapper}>
                  <View style={styles.disturbIconView}>
                    { notifications === '0' && <Icon name="md-notifications-off" style={styles.disabledIcon} /> }
                    { notifications === '1' && <Icon name="md-notifications" style={styles.enabledIcon} /> }
                  </View>
                </View>
                <View style={styles.settingTextView}>
                  <Text style={styles.settingOption}>Notifications</Text>
                  <CustomSwitch
                    value={notifications === '1'}
                    onChangeValue={(value) => this.onChangeNotification(value)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onChangeRings(rings === '0')}
                style={[styles.iconSettingView, { flex: 2 }]}
              >
                <View style={styles.settingIconWrapper}>
                  <View style={styles.disturbIconView}>
                    { rings === '0' && <Icon type="Foundation" name="volume-strike" style={styles.disabledIcon} /> }
                    { rings === '1' && <Icon type="Foundation" name="volume" style={styles.enabledIcon} /> }
                  </View>
                </View>
                <View style={styles.settingTextView}>
                  <Text style={styles.settingOption}>Rings</Text>
                  <CustomSwitch
                    value={rings === '1'}
                    onChangeValue={(value) => this.onChangeRings(value)}
                  />
                </View>
              </TouchableOpacity>
              {/* <View style={[styles.settingTextView, { flex: 2 }]}>
                <Text style={styles.settingOption}>Voicemail Greeting</Text>
                <Text style={styles.settingDescription}>EDIT</Text>
              </View> */}
              <View style={[styles.settingTextView, { flex: 3 }]}>
                <View>
                  <Text style={styles.settingOption}>Inbound Caller ID</Text>
                  <Text style={[styles.settingDescription, { width: dySize(240) }]}>
                    Show Inbound Calls as Ghost Chat number or caller's phone number
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.onChangeCaller(ghostcallerid === '1')}
                  style={[styles.inboundTextView, { borderColor: ghostcallerid === '1' ? Color.darkPurple : Color.blue }]}
                >
                  <Text style={[styles.inboundText, { color: ghostcallerid === '1' ? Color.darkPurple : Color.blue }]}>
                    {ghostcallerid === '1' ? 'GHOST' : 'CALLER'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
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
  settings: state.settings,
  isLoading: state.isLoading,
  current_did: state.current_did,
}), mapDispatchToProps)(Settings);
