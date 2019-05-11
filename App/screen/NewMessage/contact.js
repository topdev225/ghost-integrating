

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';

import { dySize, getFontSize } from '../../lib/responsive';
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { defaultPerson, chatSendIcon } from '../../lib/image';
import * as Service from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
    paddingTop: dySize(10),
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dySize(10),
  },
  toText: {
    color: Color.black,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  inputView: {
    flex: 1,
    marginHorizontal: dySize(10),
    height: dySize(50),
    justifyContent: 'center',
    paddingHorizontal: dySize(10),
    backgroundColor: Color.white,
    borderRadius: dySize(10),
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
    padding: 0,
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  listView: {
    flex: 1,
  },
  listNumber: {
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  listText: {
    fontSize: getFontSize(18),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  sectionText: {
    fontSize: getFontSize(18),
    color: Color.blue,
    paddingLeft: dySize(20),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  keyBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: dySize(30),
    paddingTop: 60,
    backgroundColor: Color.lightgray,
  },
  keyContent: {
    alignItems: 'center',
  },
  rightKeyText: {
    padding: dySize(5),
    fontSize: getFontSize(14),
    color: Color.blue,
  },
  photoView: {
    width: dySize(60),
    height: dySize(60),
    marginLeft: dySize(10),
    borderRadius: 4,
    overflow: 'hidden',
  },
  photo: {
    width: dySize(60),
    height: dySize(60),
    resizeMode: 'stretch',
  },
  contactItem: {
    height: 70,
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listLeftView: {
    paddingLeft: dySize(20),
    flex: 1,
  },
  sendIcon: {
    color: Color.blue,
    width: dySize(40),
    height: dySize(40),
    marginLeft: dySize(10),
    resizeMode: 'stretch',
  },
});

export class InboxContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      readyToSend: false,
    };
  }

  static propTypes = {
    onChangeNumber: PropTypes.func.isRequired,
    onSendSMS: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  componentDidMount() {
    this.props.checkPermission('contacts', (res) => {
      if (res === 'next') this.props.loadContacts();
    });
  }

  getKeyIndex() {
    const keys = {};
    let index = 0;
    this.sortContacts().map((item) => {
      keys[item.key] = index;
      index += 1;
      return index;
    });
    return keys;
  }

  sortContacts() {
    // convert available numbers for sorting with keys
    const result = {};
    const { searchText } = this.state;
    this.props.contacts.map((contact) => {
      const {
        phoneNumbers, emailAddresses, givenName, familyName,
      } = contact;
      const fullName = `${givenName} ${familyName}`;
      let phoneNumber;
      let emailAddress;

      if (phoneNumbers === undefined || phoneNumbers.length === 0) phoneNumber = '';
      else if (phoneNumbers.length > 0) phoneNumber = phoneNumbers[0].number.match(/\d/g).join('');

      if (emailAddresses === undefined || emailAddresses.length === 0) emailAddress = '';
      else if (emailAddresses.length > 0) emailAddress = emailAddresses[0].email;

      const subString = `${fullName},${phoneNumber},${emailAddress}`;
      // search by key
      if (subString.replace(/ /g, '').indexOf(searchText) < 0) return false;

      // sort for right key bar
      let keyString = fullName.substring(0, 1);
      keyString = keyString.toUpperCase();
      if (result[keyString] === undefined) {
        result[keyString] = [contact];
      } else {
        result[keyString].push(contact);
      }
      return true;
    });
    let array = [];
    Object.keys(result).map((key) => {
      array.push({
        key,
        list: result[key],
      });
      return array;
    });
    array = _.sortBy(array, 'key');
    return array;
  }

  onPressNumber(contact) {
    const { phoneNumbers } = contact;
    if (phoneNumbers === undefined || phoneNumbers.length === 0) {
      alert('Sorry, there is no phone number associated with this contact');
    } else {
      const params = {
        number: Service.getPhoneDigits(phoneNumbers[0].number),
        name: Service.getContactName(contact),
      };
      this.props.setSMSToNumber(params);
      // this.setState({ searchText: params.number });
      // this.onChangeInput(params.number);
      this.props.onChangeNumber(params.number);
      setTimeout(() => {
        this.props.onSendSMS();
      }, 500);
    }
  }

  onChangeInput = (text) => {
    let temp = text;
    if (text.substr(0, 1) === '1') temp = temp.substr(1);
    this.setState({ searchText: temp });
    const isnum = /^\d+$/.test(text);
    if (text.length > 8 && isnum) {
      this.props.onChangeNumber(text);
      this.setState({ readyToSend: true });
    } else this.setState({ readyToSend: false });
  }

  _renderItem = ({ item }) => (
    <View style={{ paddingRight: 20 }}>
      <Text style={styles.sectionText}>{item.key}</Text>
      {
        item.list.map((contact) => {
          const { emailAddresses, phoneNumbers, thumbnailPath } = contact;
          let info = '';
          if (emailAddresses !== undefined && emailAddresses.length > 0) {
            info = emailAddresses[0].email;
          } else if (phoneNumbers !== undefined && phoneNumbers.length > 0) {
            info = Service.beautifyPhoneFormat(contact.phoneNumbers[0].number);
          } else info = 'None';

          let photoURL = defaultPerson;
          if (thumbnailPath !== undefined && thumbnailPath.length > 0) {
            photoURL = { uri: thumbnailPath };
          }
          return (
            <TouchableOpacity
              key={JSON.stringify(contact)}
              style={styles.contactItem}
              onPress={() => this.onPressNumber(contact)}
            >
              <View style={styles.photoView}>
                <Image
                  style={styles.photo}
                  source={photoURL}
                />
              </View>
              <View style={styles.listLeftView}>
                <Text style={styles.listNumber}>{Service.getContactName(contact)}</Text>
                <Text style={styles.listText}>{info}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      }
    </View>
  )

  onPressKey(key) {
    this.currentKey = key;
    const keys = this.getKeyIndex();
    this.listView.scrollToIndex({
      index: keys[key],
      viewOffset: dySize(10),
    });
  }

  renderKeyBar() {
    return (
      <ScrollView style={styles.keyBar} contentContainerStyle={styles.keyContent}>
        {
          this.sortContacts().map((item) => (
            <TouchableOpacity key={item.key} onPress={this.onPressKey.bind(this, item.key)}>
              <Text style={styles.rightKeyText}>{item.key}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchView}>
          <Text style={styles.toText}>To: </Text>
          <View style={styles.inputView}>
            <TextInput
              placeholder="Enter a name or number"
              onChangeText={(text) => this.onChangeInput(text)}
              placeholderTextColor="#999999"
              underlineColorAndroid="transparent"
              style={styles.searchBar}
              value={this.state.searchText}
              autoCorrect={false}
              maxLength={20}
            />
          </View>
          {
            this.state.readyToSend && this.state.searchText.replace(/ /g, '').length > 0 &&
            <TouchableOpacity onPress={() => this.props.onSendSMS()}>
              <Image source={chatSendIcon} style={styles.sendIcon} />
            </TouchableOpacity>
          }
        </View>
        <View style={styles.listView}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            ref={ref => this.listView = ref}
            style={{ marginTop: dySize(20) }}
            data={this.sortContacts(this.props.contacts)} // required array|object
            renderItem={this._renderItem}
            keyExtractor={this._keyExtractor}
            onScrollToIndexFailed={() => {
              const that = this;
              this.listView.scrollToEnd({ animated: true });
              setTimeout(() => {
                that.onPressKey(that.currentKey);
              }, 800);
            }}
          />
          {this.renderKeyBar()}
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
  contacts: state.contacts,
}), mapDispatchToProps)(InboxContact);
