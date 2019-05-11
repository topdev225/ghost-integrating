

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Container } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';
import * as _ from 'lodash';
import RNPickerSelect from 'react-native-picker-select';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import { ghostIcon } from '../../lib/image';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Color from '../../lib/color';
import { areaCodes } from '../../lib/area_code';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    padding: dySize(25),
    position: 'relative',
  },
  desView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dySize(30),
  },
  iconView: {
    width: dySize(50),
    height: dySize(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dySize(25),
    backgroundColor: Color.lightgray,
  },
  ghostIcon: {
    width: dySize(36),
    height: dySize(36),
    resizeMode: 'stretch',
  },
  desText: {
    flex: 1,
    paddingLeft: dySize(15),
    color: Color.text,
    fontSize: getFontSize(20),
    fontFamily: 'TitilliumWeb-Regular',
    flexWrap: 'wrap',
  },
  inputView: {
    marginVertical: dySize(10),
    height: dySize(50),
    borderRadius: dySize(15),
    borderWidth: 1,
    borderColor: Color.purple,
    paddingHorizontal: dySize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: getFontSize(20),
    color: Color.purple,
    marginRight: dySize(10),
  },
  input: {
    flex: 1,
    color: Color.text,
    // fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(16),
  },
  buttonView: {
    height: dySize(50),
    width: dySize(325),
    borderRadius: dySize(15),
    backgroundColor: Color.purple,
    justifyContent: 'center',
    alignItems: 'center',
    left: dySize(25),
    bottom: dySize(25),
    position: 'absolute',
  },
  buttonText: {
    fontSize: getFontSize(18),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  stateView: {
    height: 50,
    marginTop: dySize(5),
    width: dySize(300),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Color.gray,
  },
  stateLabel: {
    color: Color.gray,
    fontSize: getFontSize(12),
    paddingRight: 40,
  },
  icon: {
    fontSize: getFontSize(14),
    color: Color.purple,
  },
  pickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export class CreateGhost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      state: '',
    };
  }

  componentDidMount() {

  }

  onSearch = () => {
    if (!this.checkInputs()) return;
    const { state, name } = this.state;
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      state,
    };
    this.props.getAvailableNumbers(param);
    NavigatorService.navigate('select_number', { name });
  }

  checkInputs = () => {
    if (this.state.name.replace(/ /g, '').length === 0) {
      alert('Ghost name is empty');
      return false;
    } else if (this.state.state === '') {
      alert('You must select a state');
      return false;
    }
    return true;
  }

  render() {
    const pickerStyle = {
      inputIOS: {
        fontSize: getFontSize(16),
        backgroundColor: Color.white,
        color: Color.text,
        paddingVertical: dySize(15),
      },
      underline: {
        borderTopWidth: 0,
      },
      inputAndroid: {
        backgroundColor: Color.white,
        color: Color.text,
        paddingVertical: dySize(10),
        height: dySize(48),
        width: dySize(260),
      },
    };
    return (
      <Container style={styles.container}>
        <CustomHeader
          title="Create Your Ghost"
          leftIcon="ios-arrow-back"
          onPressLeft={() => NavigatorService.goBack()}
        />
        <View style={styles.content}>
          <KeyboardAwareScrollView extraScrollHeight={100} showsVerticalScrollIndicator={false} enableOnAndroid >
            <View style={{ flex: 1 }}>
              <View style={styles.desView}>
                <View style={styles.iconView}>
                  <Image source={ghostIcon} style={styles.ghostIcon} />
                </View>
                <Text style={styles.desText}>Choose a name and area code for your Text-only Ghost</Text>
              </View>
              <View style={styles.inputView}>
                <Icon name="md-create" style={styles.inputIcon} />
                <TextInput
                  placeholder="Ghost name"
                  onChangeText={(name) => this.setState({ name })}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={Color.gray}
                  style={styles.input}
                  autoCorrect={false}
                  value={this.state.name}
                />
              </View>
              <View style={styles.inputView}>
                <Icon name="md-pin" style={styles.inputIcon} />
                <RNPickerSelect
                  placeholder={{
                    label: 'State',
                    value: '',
                  }}
                  items={areaCodes}
                  onValueChange={(value) => {
                    this.setState({ state: value });
                  }}
                  style={pickerStyle}
                  value={this.state.areaCode}
                  hideIcon
                  underlineColorAndroid="transparent"
                  useNativeAndroidPickerStyle={false}
                />
              </View>

            </View>
          </KeyboardAwareScrollView>
        </View>
        <TouchableOpacity style={styles.buttonView} onPress={() => this.onSearch()}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </Container>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
}), mapDispatchToProps)(CreateGhost);
