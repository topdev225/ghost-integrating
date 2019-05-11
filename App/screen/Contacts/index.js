

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Platform, Text, FlatList, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Header } from 'native-base';
import * as _ from 'lodash';
import Swipeable from 'react-native-swipeable-row';
import { ifIphoneX } from 'react-native-iphone-x-helper';

import { dySize, getFontSize } from '../../lib/responsive';
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { defaultPerson, contactBackground } from '../../lib/image';
import NavigatorService from '../../service/navigator';
import * as Service from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  listView: {
    flex: 1,
  },
  leftSwipeView: {
    justifyContent: 'center',
    height: dySize(60),
    alignItems: 'center',
    backgroundColor: Color.blue,
    position: 'absolute',
    right: 10,
  },
  listLeftView: {
    // width: dySize(355),
    paddingLeft: dySize(30),
    flexDirection: 'row',
    alignItems: 'center',
    height: dySize(60),
    backgroundColor: Color.white,
  },
  listNumber: {
    fontSize: getFontSize(18),
    color: Color.black,
    fontFamily: 'TitilliumWeb-Regular',
  },
  listLeftText: {
    color: Color.white,
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
  },
  listText: {
    fontSize: getFontSize(18),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
  },
  listIconView: {
    height: dySize(60),
    width: dySize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.blue,
    margin: 0,
    borderLeftWidth: 1,
    borderColor: Color.white,
  },
  listIcon: {
    fontSize: getFontSize(30),
    color: Color.white,
  },
  sectionText: {
    fontSize: getFontSize(20),
    color: Color.purple,
    paddingLeft: dySize(20),
    fontFamily: 'TitilliumWeb-Regular',
  },
  keyBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: dySize(30),
    paddingTop: 60,
    backgroundColor: Color.white,
  },
  keyContent: {
    alignItems: 'center',
  },
  rightKeyText: {
    padding: dySize(5),
    fontSize: getFontSize(14),
    color: Color.blue,
  },
  searchBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: dySize(30),
    paddingBottom: dySize(10),
    backgroundColor: Color.white,
  },
  searchBar: {
    width: dySize(315),
    height: dySize(36),
    backgroundColor: Color.lightgray,
    borderRadius: dySize(18),
    paddingLeft: dySize(20),
    paddingRight: dySize(40),
    position: 'relative',
    justifyContent: 'center',
  },
  searchText: {
    width: dySize(250),
    borderBottomWidth: 1,
    borderColor: Color.white,
    color: Color.white,
    fontSize: getFontSize(18),
    paddingBottom: dySize(5),
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },
  searchIconView: {
    width: dySize(28),
    height: dySize(28),
    position: 'absolute',
    top: 4,
    right: 4,
    bottom: 4,
    borderRadius: dySize(14),
    backgroundColor: Color.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    color: Color.white,
    fontSize: getFontSize(18),
  },
  avatarView: {
    width: dySize(40),
    height: dySize(40),
    borderRadius: dySize(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarImage: {
    width: dySize(40),
    height: dySize(40),
    resizeMode: 'stretch',
    borderRadius: 20,
  },
  avatarNameText: {
    fontSize: getFontSize(18),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(16),
    color: Color.gray,
  },
  headerView: {
    ...ifIphoneX({
      height: dySize(50),
    }, {
      height: dySize(70),
    }),
    width: dySize(375),
    flexDirection: 'row',
    paddingHorizontal: dySize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: dySize(24),
    color: Color.white,
    margin: dySize(10),
  },
  rightIconView: {
    flexDirection: 'row',
    padding: dySize(20),
    alignItems: 'center',
  },
  topBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    ...ifIphoneX({
      height: dySize(100),
    }, {
      height: dySize(70),
    }),
    width: dySize(375),
    resizeMode: 'stretch',
  },
  title: {
    fontSize: getFontSize(20),
    color: Color.white,
    backgroundColor: 'transparent',
    fontFamily: 'TitilliumWeb-Bold',
  },
  scrollTabBar: {
    height: dySize(170),
    borderWidth: 0,
    borderColor: '#00000000',
  },
  topView: {
    width: dySize(375),
    ...ifIphoneX({
      height: dySize(100),
    }, {
      height: dySize(70),
    }),
    position: 'relative',
  },
  tabBarText: {
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
    margin: 0,
    padding: 0,
    color: Color.white,
  },
  tabView: {
    marginTop: Platform.OS === 'ios' ? dySize(-50) : dySize(-52),
  },
});

export class ContactScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      searchText: '',
    };
  }

  componentDidMount() {

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

  onAdd() {

  }

  sortContacts() {
    // convert available numbers for sorting with keys
    const result = {};
    const { searchText } = this.state;
    this.props.contacts.map((contact) => {
      const fullName = `${contact.givenName} ${contact.familyName}`;
      let phoneNumber;
      let emailAddress;

      if (contact.phoneNumbers === undefined || contact.phoneNumbers.length === 0) phoneNumber = '';
      else if (contact.phoneNumbers.length > 0) phoneNumber = contact.phoneNumbers[0].number;

      if (contact.emailAddresses === undefined || contact.emailAddresses.length === 0) emailAddress = '';
      else if (contact.emailAddresses.length > 0) emailAddress = contact.emailAddresses[0].email;

      const subString = `${fullName},${phoneNumber},${emailAddress}`;
      // search by key
      if (subString.replace(/ /g, '').toLowerCase().indexOf(searchText.toLowerCase()) < 0) return false;

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
    console.log(contact);
    // alert(JSON.stringify(contact));
    NavigatorService.navigate('profile', { contact });
  }

  _renderPhoneItem = ({ item }) => {
    const rightButtons = [
      <TouchableOpacity style={styles.listIconView}>
        <Icon name="ios-videocam-outline" style={styles.listIcon} />
      </TouchableOpacity>,
      <TouchableOpacity style={styles.listIconView}>
        <Icon name="ios-call-outline" style={styles.listIcon} />
      </TouchableOpacity>,
      <TouchableOpacity style={styles.listIconView}>
        <Icon name="ios-chatbubbles-outline" style={styles.listIcon} />
      </TouchableOpacity>,
    ];
    const { leftActionActivated } = this.state;
    return (
      <View>
        {/* <Text style={styles.sectionText}>{item.key}</Text> */}
        {
          item.list.map((contact) => {
            let info = '';
            if (contact.emailAddresses !== undefined && contact.emailAddresses.length > 0) info = contact.emailAddresses[0].email;
            else if (contact.phoneNumbers !== undefined && contact.phoneNumbers.length > 0) info = Service.beautifyPhoneFormat(contact.phoneNumbers[0].number);
            else info = 'None';
            console.log(info);

            let photoURL = defaultPerson;
            let hasAvatar = false;
            if (contact.thumbnailPath !== undefined && contact.thumbnailPath.length > 0) {
              photoURL = { uri: contact.thumbnailPath };
              hasAvatar = true;
            }
            const labelName = Service.getContactName(contact);
            const RC = Service.getRandomArbitrary(50, 150);
            const GC = Service.getRandomArbitrary(50, 150);
            const BC = Service.getRandomArbitrary(50, 150);
            const avatarColor = `rgb(${RC}, ${GC}, ${BC})`;
            return (
              <Swipeable
                leftContent={(
                  <View style={styles.leftSwipeView}>
                    {!leftActionActivated && <Text style={styles.listLeftText}>Pull to check profile</Text>}
                    {leftActionActivated && <Icon style={styles.listIcon} name="md-checkmark" />}
                  </View>
                )}
                onLeftActionActivate={() => this.setState({ leftActionActivated: true })}
                onLeftActionDeactivate={() => this.setState({ leftActionActivated: false })}
                style={{ backgroundColor: Color.blue }}
                leftActionActivationDistance={dySize(200)}
                rightButtons={rightButtons}
                rightButtonWidth={60}
                key={contact.recordID}
                onLeftActionRelease={this.onPressNumber.bind(this, contact)}
              >
                <TouchableOpacity onPress={this.onPressNumber.bind(this, contact)} style={styles.listLeftView}>
                  <View style={[styles.avatarView, { backgroundColor: avatarColor }]}>
                    {/* if the avatar photo is exist */}
                    {hasAvatar && <Image source={photoURL} style={styles.avatarImage} />}
                    {/* if the full name is exist */}
                    {hasAvatar || <Text style={styles.avatarNameText}>{Service.getSimplyName(labelName)}</Text>}
                  </View>
                  <View>
                    <Text style={styles.listNumber}>{Service.getContactName(contact)}</Text>
                    {/* <Text style={styles.listText}>{info}</Text> */}
                  </View>

                </TouchableOpacity>
              </Swipeable>
            );
          })
        }
      </View>
    );
  }

  toggleSearch = () => {
    this.setState({ search: !this.state.search, searchText: '' });
  }

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
    const { search } = this.state;
    return (
      <View style={styles.container}>
        <Header style={styles.topView}>
          <Image style={styles.topBack} source={contactBackground} />
          <View style={styles.headerView}>
            <TouchableOpacity onPress={() => this.props.setDrawerState(true)}>
              <Icon name="md-menu" style={styles.headerIcon} />
            </TouchableOpacity>
            {
              search ?
                <TextInput
                  placeholder="Type Number or Name"
                  onChangeText={(text) => this.setState({ searchText: text })}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={Color.gray}
                  style={styles.searchText}
                  value={this.state.searchText}
                />
              :
                <Text style={styles.title}>CONTACTS</Text>
            }
            <TouchableOpacity onPress={() => this.toggleSearch()}>
              <Icon name={search ? 'md-close' : 'md-search'} style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </Header>
        {this.renderPhoneTapView()}
      </View>
    );
  }

  renderPhoneTapView = () => {
    if (this.props.contacts.length === 0) {
      return (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>No contacts</Text>
        </View>
      );
    }
    return (
      <View style={styles.listView}>
        <FlatList
          ref={ref => this.listView = ref}
          data={this.sortContacts(this.props.contacts)} // required array|object
          renderItem={this._renderPhoneItem}
        />
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
}), mapDispatchToProps)(ContactScreen);
