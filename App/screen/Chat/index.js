

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, AppState, Text, TextInput, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { Icon } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import Emoji from 'react-native-emoji';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import * as _ from 'lodash';

import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { chatTopBackground, chatSendIcon } from '../../lib/image';
import { dySize, getFontSize } from '../../lib/responsive';
import NavigatorService from '../../service/navigator';
import ChatBubble from './bubble';
import { pusher } from '../../lib/pusher';
import { NameToEmoji } from '../../lib/constants';
import * as Service from '../../service';

const ImagePicker = require('react-native-image-picker');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dySize(20),
    height: dySize(60),
    backgroundColor: Color.white,
  },
  inputIcon: {
    fontSize: getFontSize(20),
    padding: dySize(10),
    color: Color.buttonLightBlue,
  },
  msgInput: {
    flex: 1,
    fontSize: getFontSize(16),
    color: Color.text,
    paddingRight: dySize(10),
    justifyContent: 'center',
    fontFamily: 'TitilliumWeb-Regular',
  },
  toBottomIconView: {
    position: 'absolute',
    right: dySize(20),
    bottom: dySize(20),
    width: dySize(50),
    height: dySize(50),
    borderRadius: dySize(25),
    backgroundColor: Color.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadIcon: {
    fontSize: getFontSize(20),
    color: Color.white,
  },
  unreadView: {
    position: 'absolute',
    width: dySize(20),
    height: dySize(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dySize(10),
    top: 0,
    right: 0,
    backgroundColor: Color.red,
  },
  unreadText: {
    color: Color.white,
    fontSize: getFontSize(14),
  },
  topView: {
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(100),
      paddingTop: dySize(30),
    }, {
      height: dySize(70),
    }),
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dySize(10),
    backgroundColor: 'transparent',
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
    backgroundColor: 'transparent',
  },
  topIcon: {
    fontSize: getFontSize(20),
    padding: dySize(5),
    color: Color.white,
  },
  topText: {
    flex: 1,
    paddingLeft: dySize(20),
    fontSize: getFontSize(16),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  topRightView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendIcon: {
    width: dySize(45),
    height: dySize(45),
    resizeMode: 'stretch',
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: Color.lightgray,
  },
  emojiView: {
    height: dySize(50),
  },
  emojiList: {
    height: dySize(50),
    backgroundColor: Color.lightPurple,
  },
  emojiText: {
    fontSize: getFontSize(30),
    marginHorizontal: dySize(10),
  },
});

export class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inbox: this.props.navigation.state.params.inbox,
      name: this.props.navigation.state.params.labelName,
      fromContact: this.props.navigation.state.params.fromContact,
      msg: '',
      visible_bottomButton: false,
      appState: AppState.currentState,
      emoji: false,
      prevMsg: '',
    };
  }

  componentWillMount() {
    this.props.formatSMSHistory();
  }

  componentWillUnmount() {
    this.mounted = false;
    AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
  }

  componentDidMount() {
    this.mounted = true;
    this.scrollOffsetPercent = 100;
    this.props.setLoading(true);
    this.fetchSMSList();
    this.listenPusherTime();
    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // when switch to foreground, should detect ended call
      this.fetchSMSList();
      this.listenPusherTime();
    } else {
      // going to background
    }
    this.setState({ appState: nextAppState });
  }

  listenPusherTime() {
    const channel = pusher.subscribe(this.props.userInfo.user[0].id);
    channel.bind('new-message', (data) => {
      console.log('Pusher Data', data); // example {user_id: 4, did_id: 21, number: '123456', timestamp:''}
      if (data.number === this.state.inbox.number) {
        this.fetchSMSList();
      }
    });
  }

  fetchSMSList() {
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      number: this.state.inbox.number,
    };
    if (param.number.length === 0) return;
    this.props.fetchSMSHistory(param);
  }

  checkUnreadStatus() {
    let unread = 0;
    this.props.sms_history.map((message) => {
      if (message.sent === '0' && message.seen === '0') unread++;
      return true;
    });
    return unread;
  }

  onFocusInput() {
    const _this = this;
    setTimeout(() => {
      if (_this.mounted) {
        _this.scrollToEnd();
        _this.readMessages();
      }
    }, 200);
  }

  readMessages() {
    const unread_text_ids = [];
    this.props.sms_history.map((message) => {
      if (message.sent === '0' && message.seen === '0') unread_text_ids.push(message.text_id);
      return true;
    });
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      text_id: unread_text_ids.join(','),
    };
    if (unread_text_ids.length > 0) this.props.readMessages(param);
  }

  scrollToEnd() {
    this.scrollView && this.scrollView.scrollToEnd({ animated: true });
  }

  onPressCallIcon = () => {
    NavigatorService.navigate('ghost_call', { number: this.state.inbox.number });
  }

  sendChatSMS(data) {
    if (data === 'sms' && this.state.msg.replace(/ /g, '').length === 0) return;
    const { current_did } = this.props;
    const source = current_did.did;
    let param = {};
    if (data !== 'sms') {
      param = {
        uuid: DeviceInfo.getUniqueID(),
        type: 'mms',
        source,
        destination: this.state.inbox.number,
        file_name: data.fileName,
        file_data: data.data,
      };
      this.props.sendChatSMS(param);
    } else {
      // split messages as sms blocks
      const words = this.state.msg.split(' ');
      let temp = words[0];
      let encLength = encodeURIComponent(words[0]).length;
      let numSnippet = 0;
      for (let i = 1; i < words.length; i++) {
        if (encodeURIComponent(` ${words[i]}`).length + encLength > 255) {
          numSnippet++;
          const sms_param = {
            uuid: DeviceInfo.getUniqueID(),
            type: 'sms',
            source,
            destination: this.state.inbox.number,
            message: temp,
          };
          setTimeout(() => {
            this.props.sendChatSMS(sms_param);
          }, numSnippet * 1500);
          temp = ` ${words[i]}`;
          encLength = encodeURIComponent(` ${words[i]}`).length;
        } else {
          temp += ` ${words[i]}`;
          encLength += encodeURIComponent(` ${words[i]}`).length;
        }
      }
      // send last snippet of the message
      setTimeout(() => {
        param = {
          uuid: DeviceInfo.getUniqueID(),
          type: 'sms',
          source,
          destination: this.state.inbox.number,
          message: temp,
        };
        this.props.sendChatSMS(param);
      }, (numSnippet + 1) * 1500);
    }
    this.setState({ msg: '' });
    this.onFocusInput();
  }

  onScroll(nativeEvent) {
    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
      const paddingToBottom = 80;
      return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
    };
    this.scrollOffsetPercent = (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y) / nativeEvent.contentSize.height * 100;
    console.log('scroll offset percent: ', this.scrollOffsetPercent);
    if (this.state.visible_bottomButton === isCloseToBottom(nativeEvent)) {
      this.setState({ visible_bottomButton: !isCloseToBottom(nativeEvent) });
    }
    if (isCloseToBottom(nativeEvent)) this.readMessages();
  }

  onPressEmojiIcon = () => {
    this.setState({ emoji: !this.state.emoji });
  }

  onPressCameraIcon = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.sendChatSMS(response);
      }
    });
  }

  onPressAttachIcon = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.sendChatSMS(response);
      }
    });
  }

  _renderEmojiItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onAddEmoji(item)}>
      <Emoji name={item} style={styles.emojiText} />
    </TouchableOpacity>
  )

  onAddEmoji = (emoji) => {
    const mStr = `${this.state.msg}${NameToEmoji[emoji]} `;
    // if (encodeURIComponent(mStr).length > 256) return;
    this.setState({ msg: mStr });
  }

  onBack = () => {
    this.props.fetchInboxData(DeviceInfo.getUniqueID());
    NavigatorService.navigate('inbox');
  }

  render() {
    const that = this;
    const badge = this.checkUnreadStatus();
    const { sms_history } = this.props;
    const {
      msg, name, visible_bottomButton, emoji,
    } = this.state;
    if (this.scrollOffsetPercent > 70 && this.chatLength !== sms_history.length) this.onFocusInput();
    this.chatLength = sms_history.length;
    return (
      <View style={styles.container}>
        <View style={styles.topView}>
          <Image style={styles.topBack} source={chatTopBackground} />
          <TouchableOpacity onPress={() => this.onBack()}>
            <Icon name="ios-arrow-back" style={styles.topIcon} />
          </TouchableOpacity>
          <Text style={styles.topText}>{Service.beautifyPhoneFormat(name)}</Text>
          <View style={styles.topRightView}>
            <TouchableOpacity onPress={() => this.onPressCallIcon()}>
              <Icon name="md-call" style={styles.topIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAwareView
          animated
          style={{ flex: 1, zIndex: -1, marginTop: dySize(-20) }}
        >
          <View style={styles.scrollWrapper}>
            <ScrollView
              contentContainerStyle={{ paddingVertical: dySize(20) }}
              ref={(ref) => this.scrollView = ref}
              onScroll={({ nativeEvent }) => this.onScroll(nativeEvent)}
              scrollEventThrottle={300}
            >
              {
                _.sortBy(sms_history, 'updated_at').map((message) => {
                  const preMessage = that.PM;
                  that.PM = message;
                  return (
                    <ChatBubble
                      key={message.updated_at + message.message}
                      message={message}
                      preMessage={preMessage}
                    />
                  );
                })
              }
            </ScrollView>
            {
              visible_bottomButton &&
              <TouchableOpacity onPress={this.onFocusInput.bind(this)} style={styles.toBottomIconView}>
                <Icon name="ios-arrow-down" style={styles.unreadIcon} />
                {
                badge > 0 &&
                <View style={styles.unreadView}>
                  <Text style={styles.unreadText}>{badge}</Text>
                </View>
              }
              </TouchableOpacity>
            }
          </View>
          {
            emoji &&
            <View style={styles.emojiView}>
              <FlatList
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: dySize(10) }}
                ref={ref => this.listView = ref}
                style={styles.emojiList}
                data={Object.keys(NameToEmoji)} // required array|object
                renderItem={this._renderEmojiItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
              />
            </View>
          }
          <View style={styles.inputView}>
            <TextInput
              placeholder="Write your message"
              onChangeText={(text) => this.setState({ msg: text })}
              underlineColorAndroid="transparent"
              placeholderTextColor={Color.gray}
              style={styles.msgInput}
              autoCorrect={false}
              value={msg}
              onFocus={() => this.onFocusInput()}
              maxLength={1024}
            />
            <TouchableOpacity onPress={this.sendChatSMS.bind(this, 'sms')}>
              <Image source={chatSendIcon} style={styles.sendIcon} />
            </TouchableOpacity>
          </View>
          <View style={[styles.inputView, { height: dySize(50), paddingLeft: 10 }]}>
            <TouchableOpacity onPress={() => this.onPressEmojiIcon()}>
              <Icon name="md-sad" style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressCameraIcon()}>
              <Icon name="ios-camera" style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressAttachIcon()}>
              <Icon name="md-images" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>
        </KeyboardAwareView>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  sms_history: state.sms_history,
  routeName: state.routeName,
  current_did: state.current_did,
}), mapDispatchToProps)(ChatScreen);
