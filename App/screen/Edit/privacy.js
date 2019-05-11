

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import CustomSwitch from '../../component/switch';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  optionView: {
    paddingHorizontal: dySize(25),
    paddingVertical: dySize(15),
    flexDirection: 'row',
  },
  textView: {
    flex: 1,
  },
  option: {
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'TitilliumWeb-Regular',
  },
  explain: {
    fontSize: getFontSize(12),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
  },
});

export class EditPrivacy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      online_status: true,
      seen_status: false,
    };
  }

  componentDidMount() {

  }

  render() {
    const {
      online_status, seen_status,
    } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader
          onPressLeft={() => this.props.navigation.goBack()}
          icon="md-arrow-back"
          title="Privacy"
          backgroundColor="transparent"
          color={Color.text}
        />
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>Share "Online" Status</Text>
            <Text style={styles.explain}>You can change this setting once every 24 hours</Text>
          </View>
          <CustomSwitch
            value={online_status}
            onChangeValue={(val) => this.setState({ online_status: val })}
          />
        </View>
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>Send "Seen" Status</Text>
            <Text style={styles.explain}>Turning this setting off will hide others "Seen" status from you</Text>
          </View>
          <CustomSwitch
            value={seen_status}
            onChangeValue={(val) => this.setState({ seen_status: val })}
          />
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
}), mapDispatchToProps)(EditPrivacy);
