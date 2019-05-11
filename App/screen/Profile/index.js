

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import ElevatedView from 'react-native-elevated-view';
import LinearGradient from 'react-native-linear-gradient';


import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { contactBackground, defaultPerson } from '../../lib/image';
import { dySize, getFontSize } from '../../lib/responsive';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import * as Service from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  photoView: {
    width: dySize(375),
    height: dySize(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    width: dySize(170),
    height: dySize(170),
    borderRadius: dySize(85),
    borderColor: '#a3adba',
    borderWidth: dySize(25),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: dySize(120),
    height: dySize(120),
    resizeMode: 'stretch',
    borderRadius: dySize(60),
    overflow: 'hidden',
  },
  infoView: {
    flex: 1,
    backgroundColor: Color.white,
    paddingHorizontal: dySize(20),
  },
  name: {
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'Roboto-Bold',
    paddingVertical: dySize(20),
  },
  mobileNumberView: {
    marginVertical: dySize(10),
  },
  labelText: {
    fontSize: getFontSize(12),
    color: Color.blue,
    fontFamily: 'Roboto-Regular',
    paddingVertical: dySize(2),
  },
  infoText: {
    fontSize: getFontSize(16),
    color: Color.text,
    fontFamily: 'Roboto-Regular',
  },
  buttomView: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconView: {
    width: dySize(50),
    alignItems: 'center',
  },
  blueIcon: {
    fontSize: getFontSize(30),
    color: Color.blue,
    marginRight: 20,
  },
  whiteIcon: {
    fontSize: getFontSize(30),
    color: Color.white,
  },
  actionButtonView: {
    position: 'absolute',
    top: dySize(204),
    right: dySize(20),
    width: dySize(70),
    height: dySize(140),
    backgroundColor: Color.blue,
  },
  actionIconView: {
    width: dySize(70),
    height: dySize(70),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: Color.lightgray,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: dySize(375),
    height: dySize(350),
    bottom: 0,
    resizeMode: 'stretch',
  },
});

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: this.props.navigation.state.params.contact,
    };
  }

  componentDidMount() {
  }

  onPressShare() {

  }

  onPressStar() {

  }

  onPressCallIcon = () => {
    NavigatorService.navigate('ghost_call', {
      number: Service.getPhoneDigits(this.state.contact.phoneNumbers[0].number),
    });
  }

  onPressChatIcon = () => {
    let number = this.state.contact.phoneNumbers[0].number;
    number = Service.getPhoneDigits(number);

    this.props.setSMSToNumber({
      number,
      name: number,
    });

    const param = {
      inbox: { number },
      labelName: this.getMatchedContactName(number),
      fromContact: false,
    };
    NavigatorService.navigate('chat', param);
  }

  getMatchedContactName(number) {
    const index = this.props.contacts.findIndex((contact) => {
      const { phoneNumbers } = contact;
      return phoneNumbers !== undefined &&
        phoneNumbers.length > 0 &&
        Service.getPhoneDigits(phoneNumbers[0].number) === number;
    });
    if (index < 0) {
      return Service.beautifyPhoneFormat(number);
    }
    const matchedContact = this.props.contacts[index];
    return Service.getContactName(matchedContact);
  }

  render() {
    const { contact } = this.state;
    let number = contact.phoneNumbers[0].number;
    number = Service.getPhoneDigits(number);
    let photoURL = defaultPerson;
    if (contact.thumbnailPath !== undefined && contact.thumbnailPath.length > 0) {
      photoURL = { uri: contact.thumbnailPath };
    }
    // alert(JSON.stringify(contact));
    return (
      <View style={styles.container}>
        <Image source={contactBackground} style={styles.background} />
        <CustomHeader
          onPressLeft={() => NavigatorService.goBack()}
          leftIcon="ios-arrow-back"
          title="Profile"
          backgroundColor="transparent"
          color={Color.white}
        />
        <View style={styles.photoView}>
          <Image source={photoURL} style={styles.photo} />
        </View>
        <View style={styles.infoView}>
          <Text style={styles.name}>{this.getMatchedContactName(number)}</Text>
          <View style={styles.mobileNumberView}>
            <Text style={styles.labelText}>Mobile</Text>
            <Text style={styles.infoText}>
              {(contact.phoneNumbers === undefined || contact.phoneNumbers.length < 1) ? 'None' : Service.beautifyPhoneFormat(contact.phoneNumbers[0].number)}
            </Text>
          </View>
          <View style={styles.mobileNumberView}>
            <Text style={styles.labelText}>Email</Text>
            <Text style={styles.infoText}>
              {(contact.emailAddresses === undefined || contact.emailAddresses.length < 1) ? 'None' : contact.emailAddresses[0].email}
            </Text>
          </View>
          <View style={styles.buttomView}>
            <TouchableOpacity onPress={this.onPressStar.bind(this)} style={styles.bottomButtonView}>
              <View style={styles.iconView}>
                <Icon name="ios-star-outline" style={styles.blueIcon} />
              </View>
              <Text style={styles.infoText}>Add to Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ElevatedView elevation={4} style={styles.actionButtonView}>
          <LinearGradient
            colors={[Color.buttonDarkBlue, Color.buttonLightBlue]}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 0.0 }}
          >
            <TouchableOpacity onPress={() => this.onPressChatIcon()} style={styles.actionIconView}>
              <Icon name="ios-chatbubbles-outline" style={styles.whiteIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onPressCallIcon()} style={styles.actionIconView}>
              <Icon name="ios-call-outline" style={styles.whiteIcon} />
            </TouchableOpacity>
          </LinearGradient>
        </ElevatedView>
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
}), mapDispatchToProps)(Profile);
