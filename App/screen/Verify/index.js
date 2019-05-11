

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import NavigatorService from '../../service/navigator';
// template
import { Icon, Content } from 'native-base';
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import CustomButton from '../../component/button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  content: {
    flex: 1,
    paddingVertical: dySize(20),
    paddingHorizontal: dySize(40),
  },
  label: {
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
    color: Color.purple,
    marginVertical: dySize(30),
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
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: getFontSize(24),
  },
  buttonView: {
    height: dySize(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: dySize(40),
    borderRadius: dySize(10),
    width: dySize(295),
  },
  buttonText: {
    color: Color.white,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  modalView: {
    backgroundColor: 'white',
    padding: dySize(30),
  },
  modalHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: Color.text,
    fontSize: 20,
    marginVertical: dySize(20),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmButton: {
    height: dySize(40),
    borderRadius: dySize(10),
    width: dySize(150),
  },
  cancelButton: {
    height: dySize(40),
    borderRadius: dySize(10),
    width: dySize(120),
    backgroundColor: Color.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: Color.white,
    fontSize: getFontSize(18),
  },
  confirmText: {
    color: Color.white,
    fontSize: getFontSize(18),
  },
  invalidText: {
    color: Color.red,
    fontSize: getFontSize(12),
    textAlign: 'center',
    padding: dySize(15),
  },
});


export class VerifyPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
      showModal: false,
      incorrect: false,
    };
  }

  componentDidMount() {

  }

  sendVerificationCode = () => {
    const uuid = DeviceInfo.getUniqueID();
    const verifyPhone = this.state.phone;
    this.setState({ loading: true });
    this.props.sendCode({ uuid, verifyPhone }, (res) => {
      this.setState({ loading: false });
      if (res === 'success') {
        this.setState({ showModal: true });
      }
    });
  }

  sendConfirmCode = () => {
    const uuid = DeviceInfo.getUniqueID();
    const phoneCode = this.state.code;
    this.setState({ loading: true });
    this.props.confirmCode({ uuid, phoneCode }, (res) => {
      this.setState({ loading: false });
      if (res === 'success') {
        this.setState({ showModal: false, incorrect: false });
        setTimeout(() => {
          NavigatorService.navigate('inbox');
        });
      } else {
        this.setState({ incorrect: true });
      }
    });
  }

  render() {
    const {
      phone, code, loading, showModal, incorrect,
    } = this.state;
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Verification"
        />
        <Content contentContainerStyle={styles.content}>
          <Text style={styles.label}>
            We need to verify your phone number to begin. Please enter your number.
          </Text>
          <View style={styles.inputView}>
            <Icon name="ios-call" style={styles.inputIcon} />
            <TextInput
              onChangeText={(text) => this.setState({ phone: text })}
              underlineColorAndroid="transparent"
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
            />
          </View>
          <View style={{ flex: 1 }} />
          <View style={styles.buttonView}>
            <CustomButton
              onPress={() => this.sendVerificationCode()}
              style={styles.button}
              loading={loading}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </CustomButton>
          </View>
        </Content>
        <Modal isVisible={showModal}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>Please enter the code sent to your phone.</Text>
            <View style={styles.inputView}>
              <TextInput
                onChangeText={(text) => this.setState({ code: text })}
                underlineColorAndroid="transparent"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
              />
            </View>
            {incorrect && <Text style={styles.invalidText}>Invalid code</Text>}
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => this.setState({ showModal: false })}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </View>
              </TouchableOpacity>
              <CustomButton
                onPress={() => this.sendConfirmCode()}
                style={styles.confirmButton}
                loading={loading}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </CustomButton>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  contacts: state.contacts,
}), mapDispatchToProps)(VerifyPhoneNumber);
