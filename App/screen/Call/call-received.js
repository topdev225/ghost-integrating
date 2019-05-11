import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Content } from 'native-base';
import * as Color from '../../lib/color.js';
import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import { contactBackground, ghostIcon } from '../../lib/image';
import { dySize, getFontSize, CURRENT_HEIGHT, CURRENT_WIDTH } from '../../lib/responsive';

const PjSipModule = NativeModules.PjSipModule;
const PjSipModuleEmitter = new NativeEventEmitter(PjSipModule);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: dySize(60),
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    resizeMode: 'stretch',
    width: CURRENT_WIDTH,
    height: CURRENT_HEIGHT,
  },
  logo: {
    resizeMode: 'stretch',
    width: dySize(60),
    height: dySize(60),
  },
  callText: {
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(18),
    marginTop: dySize(30),
  },
  toNumberText: {
    color: Color.darkPurple,
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(16),
  },
  iconLineView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: dySize(60),
  },
  iconView: {
    width: dySize(50),
    height: dySize(50),
    borderRadius: dySize(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dySize(30),
  },
  icon: {
    fontSize: getFontSize(20),
  },
  endButtonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endButton: {
    width: dySize(150),
    height: dySize(50),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.lightgray,
    borderRadius: dySize(25),
  },
  endButtonText: {
    color: Color.darkPurple,
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(24),
  },
  input: {
    width: 0,
    height: 0,
  },
});

const onSessionConnect1 = (event) => {
//alert(event.abc1)
};
class CallReceived extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callDuration: 0,
      callStatus: 'Calling...',
      toNumber: props.navigation.state.params.to,
      callstatus: props.navigation.state.params.status,
      muted: false,
      speaker: false,
      keyboard: false,
      buttonText: 'END CALL',
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.startCounter();
    // if (this.state.callstatus==="outgoing"){
    //     PjSipModule.call(this.state.toNumber);
    //   }

   // PjSipModule.call(this.state.toNumber);
    //alert (this.state.callstatus)
    this.callDisconnectedSubscription= DeviceEventEmitter.addListener('def', this.onSessionConnect);
    this.callDisconnectedSubscription1= DeviceEventEmitter.addListener('def1', this.onSessionConnect1);


//    this.callDisconnectedSubscription = PjSipModuleEmitter.addListener('CallDisconnected', (args) => {
//      console.log('hung up...', args);
//      this.setState({ buttonText: 'Call Ended' });
//      setTimeout(() => {
//        NavigatorService.goBack();
//      }, 1000);
//    });
  }

  onSessionConnect = (event) => {
  this.setState({callStatus:event.abc})
  //alert(event.abc)
  
  if(event.abc=='Released'){
  this.setState({ buttonText: 'Call Ended' });
  NavigatorService.navigate('inbox');
  this.setState({ callStatus: 'Call Ended' });
        // setTimeout(() => {
        //   NavigatorService.goBack();
        // }, 1000);
      }
else if(event.abc=="StreamsRunning" ){
    this.setState({ callStatus: 'Connected' });
  }

  };

  componentWillUnmount() {
    this.mounted = false;
    this.callDisconnectedSubscription.remove();
    this.callDisconnectedSubscription1.remove();
  }

  startCounter = () => {
    setTimeout(() => {
      this.setState({ callDuration: this.state.callDuration + 1 });
      this.mounted && this.startCounter();
    }, 1000);
  }

  convertDuration = (duration) => {
    const m = Math.floor(duration / 60);
    const s = duration % 60;
    const mstr = m < 2 ? ' minute' : ' minutes';
    const sstr = s < 2 ? ' second' : ' seconds';
    return `${m + mstr} ${s < 10 ? '0' : ''}${s}${sstr}`;
  }

  onPressIcon = (what) => {
    this.setState({ [what]: !this.state[what] }, () => {
      this.state.keyboard && this.myTextInput.focus();
      what === 'muted' && PjSipModule.setMute(this.state.muted);
      what === 'speaker' && PjSipModule.setLoud(this.state.speaker);
    });
  }

  keyNumberPressed(text) {
    const key = text.substring(text.length - 1, text.length);
    PjSipModule.sendKey(key);
  }

  onEndCall = () => {
    PjSipModule.hang();
  }

  render() {
    const {
      callStatus, callDuration, toNumber, muted, speaker, keyboard, buttonText,
    } = this.state;
    return (
      <View style={styles.container}>
        <Image source={contactBackground} style={styles.background} />
        <Content style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <Image source={ghostIcon} style={styles.logo} />
          <Text style={styles.callText}>{callStatus}</Text>
          <Text style={styles.toNumberText}>{toNumber}</Text>
          <Text style={styles.callText}>{this.convertDuration(callDuration)}</Text>
          <View style={styles.iconLineView}>
            <TouchableOpacity onPress={() => this.onPressIcon('muted')}>
              <View style={[styles.iconView, { backgroundColor: muted ? Color.blue : Color.lightgray }]}>
                <Icon
                  name="ios-mic-off"
                  style={[styles.icon, { color: muted ? Color.white : Color.text }]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressIcon('keyboard')}>
              <View style={[styles.iconView, { backgroundColor: keyboard ? Color.blue : Color.lightgray }]}>
                <Icon
                  name="ios-keypad"
                  style={[styles.icon, { color: keyboard ? Color.white : Color.text }]}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressIcon('speaker')}>
              <View style={[styles.iconView, { backgroundColor: speaker ? Color.blue : Color.lightgray }]}>
                <Icon
                  type="Foundation"
                  name="volume"
                  style={[styles.icon, { color: speaker ? Color.white : Color.text }]}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TextInput
            ref={(ref) => { this.myTextInput = ref; }}
            style={styles.input}
            onChangeText={(text) => this.keyNumberPressed(text)}
          />
          <View style={styles.endButtonView}>
            <TouchableOpacity onPress={() => this.onEndCall()}>
              <View style={styles.endButton}>
                <Text style={styles.endButtonText}>{buttonText}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Content>

      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
}), mapDispatchToProps)(CallReceived);
