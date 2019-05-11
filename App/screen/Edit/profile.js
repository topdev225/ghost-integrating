

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Service from '../../service';

const ImagePicker = require('react-native-image-picker');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
  },
  content: {
    minHeight: dySize(600),
  },
  photoView: {
    height: dySize(204),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    backgroundColor: Color.gray,
    width: dySize(64),
    height: dySize(64),
    borderRadius: dySize(32),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  photo: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: dySize(64),
    height: dySize(64),
  },
  pixelText: {
    color: Color.white,
    fontSize: getFontSize(14),
  },
  photoText: {
    color: Color.gray,
    fontSize: getFontSize(14),
    paddingTop: dySize(10),
  },
  labelText: {
    fontSize: getFontSize(12),
    color: Color.blue,
    fontFamily: 'Roboto-Regular',
    paddingVertical: dySize(2),
  },
  infoView: {
    flex: 1,
    backgroundColor: Color.white,
  },
  infoSection: {
    paddingHorizontal: dySize(20),
    paddingVertical: dySize(10),
  },
  inputView: {
    height: dySize(40),
    width: dySize(335),
    justifyContent: 'center',
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'Roboto-Regular',
  },
  dobText: {
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'Roboto-Regular',
  },
});

export class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: { uri: 'none' },
      name: 'Hoang Nguyen',
      email: 'hoang.nguyen@email.com',
      mobile: '0988 123 456',
      home: '+84 274 777888',
      dob: 'Nov 20, 1990',
      isDateTimePickerVisible: false,
    };
  }

  componentDidMount() {

  }

  onEditPhoto() {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({ photo: source });
      }
    });
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
    this.setState({ dob: Service.convertDate(date) });
    this._hideDateTimePicker();
  };

  render() {
    const {
      photo, name, email, mobile, home, dob, isDateTimePickerVisible,
    } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader
          onPressLeft={() => this.props.navigation.goBack()}
          icon="md-arrow-back"
          title="Edit Profile"
          backgroundColor="transparent"
          color={Color.text}
        />
        <Content contentContainerStyle={styles.content}>
          <View style={styles.photoView}>
            <TouchableOpacity onPress={this.onEditPhoto.bind(this)} style={styles.photoWrapper}>
              <Text style={styles.pixelText}>64 x 64</Text>
              {photo.uri !== 'none' && <Image source={photo} style={styles.photo} />}
            </TouchableOpacity>
            <Text style={styles.photoText}>Add an optional profile picture</Text>
          </View>
          <View style={styles.infoView}>
            <View style={styles.infoSection}>
              <Text style={styles.labelText}>Display Name</Text>
              <TextInput
                placeholder="Enter your name here"
                onChangeText={(text) => { this.setState({ name: text }); }}
                placeholderTextColor={Color.gray}
                underlineColorAndroid="transparent"
                style={styles.inputView}
                value={name}
                autoCorrect={false}
              />
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.labelText}>Email</Text>
              <TextInput
                placeholder="Enter your name here"
                onChangeText={(text) => { this.setState({ email: text }); }}
                placeholderTextColor={Color.gray}
                underlineColorAndroid="transparent"
                style={styles.inputView}
                value={email}
                autoCorrect={false}
              />
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.labelText}>Mobile</Text>
              <TextInput
                placeholder="Enter your name here"
                onChangeText={(text) => { this.setState({ mobile: text }); }}
                placeholderTextColor={Color.gray}
                underlineColorAndroid="transparent"
                style={styles.inputView}
                value={mobile}
                autoCorrect={false}
              />
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.labelText}>Home</Text>
              <TextInput
                placeholder="Enter your name here"
                onChangeText={(text) => { this.setState({ home: text }); }}
                placeholderTextColor={Color.gray}
                underlineColorAndroid="transparent"
                style={styles.inputView}
                value={home}
                autoCorrect={false}
              />
            </View>
            <View style={[styles.infoSection, { paddingBottom: dySize(100) }]}>
              <Text style={styles.labelText}>Birthday</Text>
              <TouchableWithoutFeedback onPress={this._showDateTimePicker.bind(this)}>
                <View>
                  <Text style={styles.dobText}>{dob}</Text>
                </View>
              </TouchableWithoutFeedback>
              <DateTimePicker
                isVisible={isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                minimumDate={new Date('1900-01-01')}
                maximumDate={new Date()}
              />
            </View>
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
}), mapDispatchToProps)(EditProfile);
