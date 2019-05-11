

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import DeviceInfo from 'react-native-device-info';

import { ActionCreators } from '../../redux/action';
import { dySize, getFontSize } from '../../lib/responsive';
import { drawerBackground } from '../../lib/image';
import { beautifyPhoneFormat } from '../../service';
import * as Color from '../../lib/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: dySize(300),
    zIndex: -1,
  },
  topView: {
    width: dySize(300),
    height: dySize(234),
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    width: dySize(300),
    height: dySize(234),
    resizeMode: 'stretch',
  },
  manageView: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: dySize(25),
  },
  creditView: {
    flex: 3,
    flexDirection: 'row',
    padding: dySize(10),
  },
  buttonView: {
    flex: 3,
    flexDirection: 'row',
    padding: dySize(10),
  },
  planText: {
    fontSize: getFontSize(16),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  manageButtonView: {
    paddingHorizontal: dySize(6),
    backgroundColor: Color.white,
    borderRadius: dySize(15),
    height: dySize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 1,
    backgroundColor: Color.white,
    paddingLeft: dySize(40),
    paddingTop: dySize(40),
    paddingBottom: dySize(20),
  },
  creditItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditNumberView: {
    width: dySize(30),
    height: dySize(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: dySize(15),
    marginRight: 5,
  },
  creditText: {
    fontSize: getFontSize(12),
    color: Color.darkPurple,
    fontFamily: 'TitilliumWeb-Regular',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: Color.purple,
  },
  optionsView: {
    flex: 1,
  },
  optionItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dySize(30),
    marginVertical: dySize(5),
  },
  optionIcon: {
    color: Color.buttonLightBlue,
    fontSize: getFontSize(18),
    marginRight: dySize(20),
    width: dySize(30),
    marginTop: 4,
  },
  optionText: {
    fontSize: getFontSize(16),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
  },
  borderedOption: {
    borderRightWidth: dySize(8),
    borderRightColor: Color.purple,
  },
  numberView: {
    paddingRight: dySize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numberText: {
    color: Color.purple,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
  },
  logoutButton: {
    backgroundColor: Color.buttonLightBlue,
    paddingHorizontal: dySize(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  logoutButtonText: {
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(14),
    color: Color.white,
  },
  versionText: {
    fontSize: getFontSize(12),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
  },
});
const onSessionConnect = (event) => {
  alert(event);
};
export class MyDrawer extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  static propTypes = {
    onSelectOption: PropTypes.func.isRequired,
  }

  componentDidMount() {
    DeviceEventEmitter.addListener('onStop', onSessionConnect);
  }

  onPressDND = () => {
    this.props.saveSettings({
      ...this.state.settings,
      uuid: DeviceInfo.getUniqueID(),
      dnd: this.props.settings.dnd === '1' ? '0' : '1',
    });
  }

  render() {
    const {
      drawerOption, userInfo: { user }, settings, current_did,
    } = this.props;
    if (user === undefined) return null;
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image source={drawerBackground} style={styles.background} />
          <View style={styles.manageView}>
            <View>
              <Text style={styles.planText}>Your Plan</Text>
              <Text style={[styles.planText, { fontSize: getFontSize(12) }]}>Subscription</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.onSelectOption('select_plan')}
              style={styles.manageButtonView}
            >
              <Text style={[styles.planText, { color: Color.darkPurple }]}>MANAGE</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.creditView}>
            <View style={styles.creditItem}>
              <View style={styles.creditNumberView}>
                <Text style={styles.creditText}>{user[0].credits}</Text>
              </View>
              <Text style={[styles.planText, { fontSize: getFontSize(12), flex: 1 }]}>Credits</Text>
            </View>
            <View style={styles.creditItem}>
              <View style={styles.creditNumberView}>
                <Text style={styles.creditText}>{user[0].freeCredits}</Text>
              </View>
              <View>
                <Text style={[styles.planText, { fontSize: getFontSize(12), lineHeight: dySize(16) }]}>Auto-Renewing</Text>
                <Text style={[styles.planText, { fontSize: getFontSize(12), lineHeight: dySize(16) }]}>Line</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => this.props.onSelectOption('add_credit')}
              style={[styles.button, { marginRight: 6 }]}
            >
              <Text style={styles.planText}>Add Credits</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.onSelectOption('create_ghost')}
              style={styles.button}
            >
              <Text style={styles.planText}>Create A Ghost</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomView}>
          <View style={styles.optionsView}>
            <TouchableOpacity onPress={() => this.props.onSelectOption('inbox')}>
              <View style={[styles.optionItemView, drawerOption === 'inbox' ? styles.borderedOption : null]}>
                <Icon name="md-mail" style={styles.optionIcon} />
                <Text style={styles.optionText}>Inbox</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onSelectOption('contacts')}>
              <View style={[styles.optionItemView, drawerOption === 'contacts' ? styles.borderedOption : null]}>
                <Icon name="md-call" style={styles.optionIcon} />
                <Text style={styles.optionText}>Contacts</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressDND()}>
              <View style={styles.optionItemView}>
                <Icon type="Foundation" name={settings.dnd === '1' ? 'volume-strike' : 'volume'} style={styles.optionIcon} />
                <Text style={styles.optionText}>Do Not Disturb ({settings.dnd === '1' ? 'On' : 'Off'})</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onSelectOption('support')}>
              <View style={[styles.optionItemView, drawerOption === 'support' ? styles.borderedOption : null]}>
                <Icon name="ios-help-circle" style={styles.optionIcon} />
                <Text style={styles.optionText}>Support</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onSelectOption('setting')}>
              <View style={[styles.optionItemView, drawerOption === 'setting' ? styles.borderedOption : null]}>
                <Icon name="md-settings" style={styles.optionIcon} />
                <Text style={styles.optionText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.numberView}>
            <Text style={styles.numberText}>{beautifyPhoneFormat(current_did.did)}</Text>
            {/* <TouchableOpacity onPress={() => this.props.onSelectOption('logout')}>
              <View style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>LOG OUT</Text>
              </View>
            </TouchableOpacity> */}
          </View>
          <Text style={styles.versionText}>2018. Ghost Chat V2</Text>
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
  current_did: state.current_did,
}), mapDispatchToProps)(MyDrawer);
