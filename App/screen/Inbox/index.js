

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Image, BackHandler, DeviceEventEmitter, Text, Clipboard, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import { Icon } from 'native-base';
import Moment from 'react-moment';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Modal from 'react-native-modal';
import { Endpoint } from 'react-native-pjsip';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import * as Color from '../../lib/color';
import { dySize, getFontSize } from '../../lib/responsive';
import { contactBackground, ghostIcon, defaultPerson, inboxBottom } from '../../lib/image';
import * as Service from '../../service';
import { pusher } from '../../lib/pusher';
import InboxView from './inbox';
import { PJSIP_CONFIG } from '../../lib/config';

Moment.globalFormat = 'ddd MMM DD';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
  },
  topView: {
    width: dySize(375),
    height: dySize(150),
    position: 'relative',
    backgroundColor: 'transparent',
    ...ifIphoneX({
      paddingTop: 30,
    }, {
      paddingTop: 0,
    }),
  },
  topBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: dySize(375),
    height: dySize(150),
    resizeMode: 'stretch',
    backgroundColor: 'transparent',
  },
  topHeader: {
    height: dySize(65),
    flexDirection: 'row',
  },
  topIcon: {
    fontSize: getFontSize(20),
    padding: 10,
    color: Color.white,
  },
  topLeftView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleView: {
    flex: 1,
    justifyContent: 'center',
  },
  topRightView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    textAlign: 'center',
    color: Color.white,
    fontFamily: 'TitilliumWeb-Bold',
    fontSize: getFontSize(20),
  },
  topLogo: {
    width: dySize(25),
    height: dySize(25),
    resizeMode: 'stretch',
    marginLeft: dySize(15),
  },
  numberView: {
    flex: 1,
    alignItems: 'center',
  },
  numberTitle: {
    color: Color.darkPurple,
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(16),
  },
  title: {
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(20),
  },
  avatarImage: {
    width: dySize(48),
    height: dySize(48),
    resizeMode: 'stretch',
    borderRadius: 4,
  },
  avatarNameText: {
    fontSize: getFontSize(20),
    color: Color.white,
  },
  scrollView: {
    flex: 1,
  },
  bottomView: {
    ...ifIphoneX({
      height: dySize(100),
    }, {
      height: dySize(70),
    }),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bottomIconView: {
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
  bottomIcon: {
    fontSize: getFontSize(50),
    padding: dySize(10),
    marginHorizontal: dySize(12),
    color: Color.purple,
  },
  modalView: {
    backgroundColor: 'white',
    padding: dySize(30),
  },
  modalHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Color.text,
    fontSize: 20,
    marginVertical: dySize(20),
  },
  modalItemView: {
    marginVertical: dySize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    color: Color.black,
    fontSize: 30,
    width: dySize(35),
  },
  modalItemText: {
    color: Color.text,
    fontSize: 18,
  },
  modalFooter: {
    alignItems: 'flex-end',
  },
  modalFooterText: {
    color: Color.gray,
    fontSize: 16,
    marginTop: dySize(25),
  },
  copyIcon: {
    color: Color.black,
    fontSize: 20,
    width: dySize(35),
  },
  scrollTabBar: {
    borderWidth: 0,
    height: dySize(50),
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
});

export class InboxScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTabIndex: 0,
      searchText: '',
      refreshing: false,
      isModalVisible: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.loadContacts();
    this.fetchInboxData();
    this.listenPusherTime();
    this.receive = DeviceEventEmitter.addListener('def', this.receiveCall);
    this.getCallHistories();
    this.props.getSettings(DeviceInfo.getUniqueID());
    this.preparePJSIPClient();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  preparePJSIPClient = async () => {
    const endpoint = new Endpoint();
    const state = await endpoint.start();
    console.log('Mickey Call State: ', state);

    endpoint.createAccount(PJSIP_CONFIG).then(async (account) => {
      console.log('Account created', account);
      const options = {
        headers: {
          'P-Assserted-Identity': 'Header example',
          'X-UA': 'React Native',
        },
      };
      const call = await endpoint.makeCall(account, '17209905259', options);
      console.log('CallID', call.getId());
    });
  }

  handleBackButton = () => {
    BackHandler.exitApp();
    this.receive.remove();
    return true;
  }

  receiveCall = (event) => {
    // alert(event.name)
    if (event.abc === 'IncomingReceived') {
      NavigatorService.navigate('call_receiver', { name: event.name });
    } else if (event.abc === 'End') {
      NavigatorService.navigate('inbox');
    }
  };


  loadContacts = () => {
    this.props.checkPermission('contacts', (res) => {
      if (res === 'next') {
        this.props.loadContacts();
      }
    });
  }

  fetchInboxData() {
    const UDID = DeviceInfo.getUniqueID();
    console.log('UDID: ', UDID);
    this.props.fetchInboxData(UDID);
  }

  listenPusherTime() {
    const channel = pusher.subscribe(this.props.userInfo.user[0].id);
    channel.bind('new-message', (data) => {
      console.log('Pusher Data', data);
      this.fetchInboxData();
    });
  }

  getCallHistories = () => {
    const params = {
      userId: this.props.userInfo.user[0].id,
      uuid: DeviceInfo.getUniqueID(),
    };
    this.props.getCallHistory(params);
  }

  onPressDisturbIcon = () => {
    this.props.saveSettings({
      ...this.state.settings,
      uuid: DeviceInfo.getUniqueID(),
      dnd: this.props.settings.dnd === '1' ? '0' : '1',
    });
  }

  onPressChatIcon = () => {
    NavigatorService.navigate('new_message');
  }

  onPressSettingIcon = () => {
    NavigatorService.navigate('setting');
  }

  onPressCallIcon = () => {
    NavigatorService.navigate('ghost_call');
  }

  _renderEmptyView = () => (
    <View style={styles.emptyView}>
      {!this.props.isLoading && <Text style={styles.emptyText}>No chat or call history to display</Text>}
    </View>
  )

  _onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false });
        this._toggleModal();
      });
    });
  }

  _onPressMark = () => {
    this._toggleModal();
  }

  _onPressDelete = () => {
    alert('comming soon');
    this._toggleModal();
  }

  _onPressCopy = () => {
    Clipboard.setString(this.props.current_did.did);
    Service.showToast('Copied!');
    this._toggleModal();
  }

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  onLoadServiceTab(index) {
    const { dids } = this.props.userInfo;
    this.setState({ scrollTabIndex: index });
    this.props.setCurrentDID(dids[index]);
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      default:
        break;
    }
  }

  render() {
    const { userInfo, settings, current_did } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image style={styles.topBack} source={contactBackground} />
          <View style={styles.topHeader}>
            <View style={styles.topLeftView}>
              <TouchableOpacity onPress={() => this.props.setDrawerState(true)}>
                <Icon name="ios-menu" style={styles.topIcon} />
              </TouchableOpacity>
              <Image style={styles.topLogo} source={ghostIcon} />
            </View>
            <View style={styles.titleView}>
              <Text style={styles.headerTitle}>Ghost Chat</Text>
            </View>
            <View style={styles.topRightView}>
              <TouchableOpacity onPress={() => this.onPressDisturbIcon()}>
                <Icon type="Foundation" name={settings.dnd === '1' ? 'volume-strike' : 'volume'} style={styles.topIcon} />
              </TouchableOpacity>
            </View>
          </View>
          {
            userInfo.dids.length === 0 &&
            <View style={styles.numberView}>
              <Text style={styles.numberTitle}>{userInfo.user[0].trialFriendlyName}</Text>
            </View>
          }
        </View>
        {
          userInfo.dids.length > 0 ?
            <ScrollableTabView
              renderTabBar={() => <ScrollableTabBar style={styles.scrollTabBar} />}
              initialPage={0}
              page={this.state.scrollTabIndex}
              tabBarUnderlineStyle={{ backgroundColor: Color.purple, height: 2 }}
              tabBarTextStyle={{
                fontSize: getFontSize(16), margin: 0, padding: 0,
              }}
              tabBarActiveTextColor={Color.yellow}
              onChangeTab={(tab) => { this.onLoadServiceTab(tab.i); }}
              tabBarInactiveTextColor={Color.lightgray}
              tabBarPosition="top"
              style={{ marginTop: dySize(-50) }}
            >
              {
                userInfo.dids.map((did) => (
                  <View key={did.friendlyName} tabLabel={did.friendlyName} style={{ flex: 1 }}>
                    <InboxView
                      toggleModal={() => this._toggleModal()}
                    />
                  </View>
                  ))
              }
            </ScrollableTabView>
          :
            <InboxView toggleModal={() => this._toggleModal()} />
        }
        <View style={styles.bottomView}>
          <Image source={inboxBottom} style={styles.bottomIconView} />
          <TouchableOpacity onPress={() => this.onPressChatIcon()}>
            <Icon name="ios-text" style={styles.bottomIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressCallIcon()}>
            <Icon name="md-call" style={styles.bottomIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onPressSettingIcon()}>
            <Icon name="md-settings" style={styles.bottomIcon} />
          </TouchableOpacity>
        </View>
        <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isModalVisible: false })}>>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>{`My ${current_did.name} Actions`}</Text>
            <TouchableOpacity onPress={this._onPressMark}>
              <View style={styles.modalItemView}>
                <Icon name="ios-checkmark" style={styles.modalIcon} />
                <Text style={styles.modalItemText}>Mark all as read</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onPressDelete}>
              <View style={styles.modalItemView}>
                <Icon name="ios-close" style={styles.modalIcon} />
                <Text style={styles.modalItemText}>Delete all messages</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onPressCopy}>
              <View style={styles.modalItemView}>
                <Icon type="Foundation" name="page-copy" style={styles.copyIcon} />
                <Text style={styles.modalItemText}>Copy number</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={this._toggleModal}>
                <Text style={styles.modalFooterText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  contacts: state.contacts,
  unread_status: state.unread_status,
  settings: state.settings,
  isLoading: state.isLoading,
  current_did: state.current_did,
}), mapDispatchToProps)(InboxScreen);
