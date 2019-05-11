

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swiper from 'react-native-swiper';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Color from '../../lib/color';
import * as Images from '../../lib/image';

const StepData = [
  {
    key: 1,
    image: Images.topLogoStep1,
    title: Images.logoTextStep1,
    text: "Use Ghost SMS to send private, anonymous messages using a different phone number than your own. They will never know it's you",
  },
  {
    key: 2,
    image: Images.topLogoStep2,
    title: Images.logoTextStep2,
    text: "Easily send and receive texts with easy access to your contacts. Just select who you'd like to message, and chat back and forth.",
  },
  {
    key: 3,
    image: Images.topLogoStep3,
    title: Images.logoTextStep3,
    text: 'Depending on your plan, you can also send and receive calls from your new annoymous number.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  pageItem: {
    flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
  },
  topLogo: {
    width: dySize(375),
    height: dySize(317),
    resizeMode: 'stretch',
  },
  logoText: {
    width: dySize(375),
    height: dySize(30),
    resizeMode: 'contain',
  },
  explain: {
    fontSize: getFontSize(18),
    lineHeight: 20,
    color: Color.blueText,
    padding: dySize(25),
    fontFamily: 'TitilliumWeb-Regular',
    textAlign: 'center',
  },
  skipView: {
    position: 'absolute',
    right: dySize(32),
    bottom: dySize(25),
  },
  skipText: {
    fontSize: getFontSize(14),
    color: Color.white,
    padding: 10,
  },
  doneText: {
    color: Color.white,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
  },
  dotStyle: {
    marginRight: 6,
    marginLeft: 6,
    backgroundColor: Color.gray,
  },
  activeDotStyle: {
    marginRight: 6,
    marginLeft: 6,
    backgroundColor: Color.purple,
  },
  bottomLogo: {
    height: dySize(71),
    width: dySize(375),
    resizeMode: 'stretch',
  },
});

export class StepScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  componentDidMount() {

  }

  onEndStep() {
    NavigatorService.navigate('welcome');
  }

  render() {
    return (
      <View style={styles.container}>
        <Swiper
          activeDotColor={Color.blue}
          loop={false}
          paginationStyle={{ paddingBottom: dySize(70) }}
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          onIndexChanged={(index) => this.setState({ slideIndex: index })}
        >
          {
            StepData.map((page) => (
              <View key={page.key} style={styles.pageItem}>
                <Image source={page.image} style={styles.topLogo} />
                <Image source={page.title} style={styles.logoText} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.explain}>{page.text}</Text>
                </View>
                <Image source={Images.bottomLogoStep} style={styles.bottomLogo} />
              </View>
            ))
          }
        </Swiper>
        <TouchableOpacity onPress={this.onEndStep.bind(this)} style={styles.skipView}>
          <Text style={styles.skipText}>{this.state.slideIndex === 2 ? 'CONTINUE' : 'SKIP'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
}), mapDispatchToProps)(StepScreen);
