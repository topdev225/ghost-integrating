

/* jshint esversion: 6 *//* jshint node: true */
import React from 'react';
// import { Switch } from 'react-native';
import PropTypes from 'prop-types';
import { Switch } from 'native-base';
// import { Switch } from 'react-native-switch';

import * as Color from '../lib/color';
import { dySize } from '../lib/responsive';

export default class CustomSwitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
  }

  render() {
    const { value } = this.props;
    return (
      // <Switch
      //   barHeight={dySize(14)}
      //   circleSize={dySize(18)}
      //   circleBorderWidth={0}
      //   value={this.props.value}
      //   onValueChange={(val) => this.props.onChangeValue(val)}
      //   circleColorActive={Color.white}
      //   circleColorInactive={Color.white}
      //   backgroundActive={Color.buttonLightBlue}
      //   backgroundInactive={Color.gray}
      //   circleActiveColor={Color.purple}
      //   circleInActiveColor={Color.purple}
      //   switchWidthMultiplier={1.5}
      //   containerStyle={{ overflow: 'visible' }}
      // />
      <Switch
        value={value}
        onValueChange={(val) => this.props.onChangeValue(val)}
        trackColor={{ false: Color.gray, true: Color.purple }}
        thumbColor={Color.purple}
      />
    );
  }
}
