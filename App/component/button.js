

/* jshint esversion: 6 *//* jshint node: true */
import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialIndicator } from 'react-native-indicators';

import * as Color from '../lib/color';
import { dySize } from '../lib/responsive';
import { styles } from 'react-native-material-ripple/styles';

export default class CustomButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    style: {},
    loading: false,
  }

  render() {
    const buttonStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      width: dySize(300),
      height: dySize(40),
      backgroundColor: Color.lightPurple,
      position: 'relative',
    };
    return (
      <TouchableOpacity style={[buttonStyle, this.props.style]} onPress={() => this.props.onPress()}>
        <LinearGradient
          style={[buttonStyle, this.props.style]}
          colors={[Color.lightPurple, Color.lightPurple]}
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 0.0, y: 1.0 }}
        >
          {this.props.children}
          {
            this.props.loading &&
            <View style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: dySize(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              <MaterialIndicator color={Color.white} size={dySize(20)} />
            </View>
          }
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}
