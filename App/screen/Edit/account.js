

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';

import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import NavigatorService from '../../service/navigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: dySize(30),
  },
  sectionView: {
    paddingVertical: dySize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    width: dySize(300),
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'TitilliumWeb-Regular',
  },
  icon: {
    fontSize: dySize(16),
    color: Color.gray,
  },
});

export class EditAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  onPressPrivacy() {
    NavigatorService.navigate('edit_privacy');
  }

  onPressSecurity() {

  }

  onPressChangeNumber() {

  }

  onPressBackup() {

  }

  onPressDeactive() {

  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          onPressLeft={() => this.props.navigation.goBack()}
          icon="md-arrow-back"
          title="Account"
          backgroundColor="transparent"
          color={Color.text}
        />
        <View style={styles.content}>
          <View style={styles.sectionView}>
            <TouchableOpacity onPress={this.onPressPrivacy.bind(this)}>
              <Text style={styles.text}>Privacy</Text>
            </TouchableOpacity>
            <Icon name="ios-arrow-forward-outline" style={styles.icon} />
          </View>
          <View style={styles.sectionView}>
            <TouchableOpacity onPress={this.onPressSecurity.bind(this)}>
              <Text style={styles.text}>Security</Text>
            </TouchableOpacity>
            <Icon name="ios-arrow-forward-outline" style={styles.icon} />
          </View>
          <View style={styles.sectionView}>
            <TouchableOpacity onPress={this.onPressChangeNumber.bind(this)}>
              <Text style={styles.text}>Change Number</Text>
            </TouchableOpacity>
            <Icon name="ios-arrow-forward-outline" style={styles.icon} />
          </View>
          <View style={styles.sectionView}>
            <TouchableOpacity onPress={this.onPressBackup.bind(this)}>
              <Text style={styles.text}>Backup</Text>
            </TouchableOpacity>
            <Icon name="ios-arrow-forward-outline" style={styles.icon} />
          </View>
          <View style={styles.sectionView}>
            <TouchableOpacity onPress={this.onPressDeactive.bind(this)}>
              <Text style={styles.text}>Deactive Account</Text>
            </TouchableOpacity>
            <Icon name="ios-arrow-forward-outline" style={styles.icon} />
          </View>
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
}), mapDispatchToProps)(EditAccount);
