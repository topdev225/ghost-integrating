

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header, Icon } from 'native-base';

import { ActionCreators } from '../redux/action';
import { dySize, getFontSize } from '../lib/responsive';
import { contactBackground } from '../lib/image';
import * as Color from '../lib/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  icon: {
    width: dySize(30),
    textAlign: 'center',
    paddingVertical: dySize(5),
    fontSize: getFontSize(20),
  },
  topText: {
    fontSize: getFontSize(20),
    color: Color.white,
    backgroundColor: 'transparent',
    fontFamily: 'TitilliumWeb-Bold',
  },
  header: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
    elevation: 0,
    width: dySize(375),
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: dySize(375),
    height: dySize(120),
    bottom: 0,
    resizeMode: 'stretch',
  },
});

export class CustomHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    onPressLeft: PropTypes.func.isRequired,
    leftIcon: PropTypes.string.isRequired,
    rightIcon: PropTypes.string,
    onPressRight: PropTypes.func,
    title: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
  }

  static defaultProps = {
    backgroundColor: Color.white,
    color: Color.white,
    rightIcon: 'none',
    onPressRight: () => undefined,
  }

  componentDidMount() {

  }

  render() {
    const {
      backgroundColor, color, leftIcon, rightIcon,
    } = this.props;
    return (
      <Header style={[styles.header, { backgroundColor }]}>
        {backgroundColor !== 'transparent' && <Image style={styles.background} source={contactBackground} />}
        <TouchableOpacity onPress={() => this.props.onPressLeft()}>
          <Icon name={leftIcon} style={[styles.icon, { color }]} />
        </TouchableOpacity>
        <Text style={[styles.topText, { color }]}>{this.props.title}</Text>
        {
          rightIcon !== 'none' ?
            <TouchableOpacity onPress={() => this.props.onPressRight()}>
              <Icon name={rightIcon} style={[styles.icon, { color }]} />
            </TouchableOpacity>
          :
            <View style={{ width: dySize(30) }} />
        }
      </Header>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
}), mapDispatchToProps)(CustomHeader);
