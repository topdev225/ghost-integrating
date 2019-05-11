

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import NavigatorService from '../../service/navigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  navBar: {
    height: 50,
    backgroundColor: Color.blue,
  },

  navBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 10,
  },

  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  navTitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    marginTop: 15,
  },
  title: {
    color: Color.blue,
    backgroundColor: 'transparent',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 6,
  },
  info: {
    fontSize: 18,
    color: Color.text,
    backgroundColor: 'transparent',
    borderRadius: 4,
    padding: 6,
  },
  logoView: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bitchesView: {
    width: 280,
    height: 170.1,
    resizeMode: 'stretch',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export class SecretView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const { userInfo: { user: [me] } } = this.props;
    return (
      <View style={styles.container}>
        <CustomHeader
          title="YOUR INFORMATION"
          leftIcon="ios-arrow-back"
          onPressLeft={() => NavigatorService.goBack()}
        />
        <View style={{ padding: 20, flex: 1 }}>
          <View style={styles.section}>
            <Text style={styles.title}>Device UUID</Text>
            <Text style={styles.info}>{DeviceInfo.getUniqueID()}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>User ID</Text>
            <Text style={styles.info}>{me.id}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Credits</Text>
            <Text style={styles.info}>{me.credits}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Platform</Text>
            <Text style={styles.info}>{Platform.OS}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Platform Version</Text>
            <Text style={styles.info}>{Platform.Version}</Text>
          </View>
          {/* <Image style={styles.bitchesView} source={require('../../image/bitches.png')} /> */}
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
}), mapDispatchToProps)(SecretView);
