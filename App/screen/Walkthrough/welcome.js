

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Color from '../../lib/color';
import { logoTextWelcome, topLogoWelcome, bottomLogoStep } from '../../lib/image';
import CustomButton from '../../component/button';

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
  logoTextView: {
    paddingVertical: dySize(15),
  },
  logoText: {
    width: dySize(300),
    height: dySize(20),
    resizeMode: 'contain',
  },
  subtitle: {
    color: Color.blueText,
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
  },
  termText: {
    color: Color.blueText,
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
    marginTop: dySize(20),
  },
  termButtonText: {
    color: Color.blue,
    fontSize: getFontSize(14),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  continue: {
    color: Color.white,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  button: {
    height: dySize(44),
    borderRadius: dySize(22),
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomLogo: {
    height: dySize(71),
    width: dySize(375),
    resizeMode: 'stretch',
  },
});

export class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  goToTerms() {
    NavigatorService.navigate('terms');
  }

  continue() {
    NavigatorService.navigate('select_region');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topLogoView}>
          <Image source={topLogoWelcome} style={styles.topLogo} />
        </View>
        <View style={styles.logoTextView}>
          <Image source={logoTextWelcome} style={styles.logoText} />
        </View>
        <Text style={styles.subtitle}>Anonymous texting & calling</Text>
        <View style={styles.buttonView}>
          <CustomButton onPress={this.continue.bind(this)} style={styles.button}>
            <Text style={styles.continue}>Continue</Text>
          </CustomButton>
          <Text style={styles.termText}>I read and accept the Ghost SMS</Text>
          <TouchableOpacity onPress={this.goToTerms.bind(this)}>
            <Text style={styles.termButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
        <Image source={bottomLogoStep} style={styles.bottomLogo} />
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
}), mapDispatchToProps)(Welcome);
