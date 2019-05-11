

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import CustomSwitch from '../../component/switch';
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';

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

export class EditNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      In_App_Vibrate: false,
      In_App_Sounds: false,
      show_banner: false,
      show_message: false,
    };
  }

  componentDidMount() {

  }

  render() {
    const {
      In_App_Vibrate, In_App_Sounds, show_banner, show_message,
    } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader
          onPressLeft={() => this.props.navigation.goBack()}
          icon="md-arrow-back"
          title="Notifications"
          backgroundColor="transparent"
          color={Color.text}
        />
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>In-App Vibrate</Text>
            <Text style={styles.explain}>Description for this notification</Text>
          </View>
          <CustomSwitch
            value={In_App_Vibrate}
            onChangeValue={(val) => this.setState({ In_App_Vibrate: val })}
          />
        </View>
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>In-App Sounds</Text>
            <Text style={styles.explain}>Description for this notification</Text>
          </View>
          <CustomSwitch
            value={In_App_Sounds}
            onChangeValue={(val) => this.setState({ In_App_Sounds: val })}
          />
        </View>
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>Show In-App Banner</Text>
            <Text style={styles.explain}>Description for this notification</Text>
          </View>
          <CustomSwitch
            value={show_banner}
            onChangeValue={(val) => this.setState({ show_banner: val })}
          />
        </View>
        <View style={styles.optionView}>
          <View style={styles.textView}>
            <Text style={styles.option}>Show Message Preveiw</Text>
            <Text style={styles.explain}>Description for this notification</Text>
          </View>
          <CustomSwitch
            value={show_message}
            onChangeValue={(val) => this.setState({ show_message: val })}
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
}), mapDispatchToProps)(EditNotification);
