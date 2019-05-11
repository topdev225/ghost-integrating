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
  Vibration,
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
    width: dySize(70),
    height: dySize(70),
    borderRadius: dySize(35),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dySize(30),
  },
  icon: {
    fontSize: getFontSize(30),
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


class CallReceiver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toNumber: props.navigation.state.params.name,
    };
  }

  componentDidMount() {
    // Vibration.vibrate();
    //     this.mounted = true;
    //     this.startCounter();

    //     PjSipModule.call(this.state.toNumber);

    //  this.callDisconnectedSubscription= DeviceEventEmitter.addListener('def', this.onSessionConnect);
    //  this.callDisconnectedSubscription1= DeviceEventEmitter.addListener('def1', this.onSessionConnect1);


    //    this.callDisconnectedSubscription = PjSipModuleEmitter.addListener('CallDisconnected', (args) => {
    //      console.log('hung up...', args);
    //      this.setState({ buttonText: 'Call Ended' });
    //      setTimeout(() => {
    //        NavigatorService.goBack();
    //      }, 1000);
    //    });
  }

  componentWillUnmount() {
    // Vibration.cancel();
    // this.mounted = false;
    // this.callDisconnectedSubscription.remove();
    //   this.callDisconnectedSubscription1.remove();
  }

  answer = () => {
    PjSipModule.answer();
    NavigatorService.navigate('call_received', { to: this.state.toNumber,status: 'incoming' });
  }

  decline = () => {
    PjSipModule.hang();
    NavigatorService.navigate('inbox');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={contactBackground} style={styles.background} />
        <Content style={{ flex: 1 }} contentContainerStyle={styles.container}>
          <Image source={ghostIcon} style={styles.logo} />
          <Text style={styles.callText}>Incoming Call</Text>
          <Text style={styles.toNumberText}>{this.state.toNumber}</Text>
          <View style={styles.iconLineView}>
            <TouchableOpacity onPress={() => this.answer()}>
              <View style={[styles.iconView, { backgroundColor: Color.green }]}>
                <Icon
                  type="MaterialIcons"
                  name="call"
                  style={[styles.icon, { color: Color.black }]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.decline()}>
              <View style={[styles.iconView, { backgroundColor: Color.red }]}>
                <Icon
                  type="MaterialIcons"
                  name="call-end"
                  style={[styles.icon, { color: Color.black }]}
                />
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
}), mapDispatchToProps)(CallReceiver);
