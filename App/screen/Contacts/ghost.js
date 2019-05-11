

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeviceInfo from 'react-native-device-info';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import * as Color from '../../lib/color';
import { dySize, getFontSize } from '../../lib/responsive';
import { defaultPerson } from '../../lib/image';
import * as Service from '../../service';
import { pusher } from '../../lib/pusher';

const avatar_bg_array = [
  '#63ffd1',
  '#b8b8b8',
  '#63b8ff',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dySize(60),
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  avatarImage: {
    width: dySize(48),
    height: dySize(48),
    resizeMode: 'stretch',
    borderRadius: 4,
  },
  avatarNameText: {
    fontSize: getFontSize(20),
    color: Color.white,
  },
  inboxInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: getFontSize(18),
    color: Color.text,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  message: {
    fontSize: getFontSize(18),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
    height: dySize(30),
    paddingRight: 20,
  },
  time: {
    fontSize: getFontSize(12),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
    paddingBottom: dySize(10),
  },
  scrollView: {
    flex: 1,
    paddingTop: dySize(15),
  },
  addButton: {
    width: dySize(65),
    height: dySize(65),
    resizeMode: 'stretch',
  },
  avatarView: {
    width: dySize(48),
    height: dySize(48),
    borderRadius: dySize(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  badgeView: {
    backgroundColor: Color.red,
    borderRadius: dySize(15),
    height: dySize(24),
    width: dySize(24),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  badgeText: {
    color: Color.white,
  },
  addButtonContainer: {
    position: 'absolute',
    height: dySize(100),
    width: dySize(375),
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class GhostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTabIndex: 0,
      searchText: '',
    };
  }

  componentDidMount() {
    this.fetchInboxData();
    this.listenPusherTime();
  }

  fetchInboxData() {
    const UDID = DeviceInfo.getUniqueID();
    console.log('UDID: ', UDID);
    this.props.fetchInboxData(UDID);
  }

  listenPusherTime() {
    const channel = pusher.subscribe(this.props.userInfo.user[0].id);
    channel.bind('new-message', (data) => {
      console.log('Pusher Data', data);
      this.fetchInboxData();
    });
  }

  onPressInbox(inbox, labelName, photoURL) {
    this.props.setSelectedUserPhoto(photoURL);
    NavigatorService.navigate('chat', {
      inbox,
      labelName,
      onBack: () => this.fetchInboxData(),
    });
  }

  getMatchedContact(number) {
    const index = this.props.contacts.findIndex((contact) => {
      if (contact.phoneNumbers !== undefined &&
        contact.phoneNumbers.length > 0 &&
        Service.getPhoneDigits(contact.phoneNumbers[0].number) === number) return true;
      return false;
    });
    if (index < 0) {
      return { result: 'Not Found' };
    }
    const matchedContact = this.props.contacts[index];
    return matchedContact;
  }

  renderInboxItem(inbox, index, tag) {
    // fetching Name and Photo
    const contact = this.getMatchedContact(inbox.number);
    let labelName = inbox.number;
    if (contact.result !== 'Not Found') {
      labelName = Service.getContactName(contact);
    }
    let photoURL = defaultPerson;
    let hasAvatar = false;
    if (contact.thumbnailPath !== undefined && contact.thumbnailPath.length > 0) {
      photoURL = { uri: contact.thumbnailPath };
      hasAvatar = true;
    }
    // Fetching unread message
    const badge = this.props.unread_status[inbox.number];

    if (badge === undefined && tag === 'unread') return null;
    if (contact.result !== 'Not Found' && tag === 'unknown') return null;

    // Filtering by Search Text
    if (Service.beautifyPhoneFormat(labelName).toLowerCase().indexOf(this.state.searchText.toLowerCase()) < 0) return null;
    return (
      <TouchableOpacity key={inbox.number} onPress={this.onPressInbox.bind(this, inbox, labelName, photoURL)} style={styles.inboxItem}>
        <View style={[styles.avatarView, { backgroundColor: avatar_bg_array[index % 3] }]}>
          {/* if the avatar photo is exist */}
          {hasAvatar && <Image source={photoURL} style={styles.avatarImage} />}
          {/* if the full name is exist */}
          {labelName !== inbox.number && <Text style={styles.avatarNameText}>{Service.getSimplyName(labelName)}</Text>}
        </View>
        <View style={styles.inboxInfo}>
          <Text style={styles.name}>{Service.beautifyPhoneFormat(labelName)}</Text>
          <Text style={[styles.message, { fontWeight: badge !== undefined ? 'bold' : 'normal' }]}>{Service.decodeMessage(inbox.message)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.time}>{Service.convertTime(Number(inbox.updated_at * 1000))}</Text>
          {
            badge !== undefined &&
            <View style={styles.badgeView}>
              <Text style={styles.badgeText}>{badge > 99 ? '99' : badge}</Text>
            </View>
          }
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { inboxData } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {inboxData.map((inbox, index) => this.renderInboxItem(inbox, index, 'all'))}
        </ScrollView>
        {/* <LinearGradient
          style={styles.addButtonContainer}
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1.0 }}
        >
          <TouchableOpacity onPress={this.onAdd.bind(this)} style={styles.addButtonView}>
            <Image source={addButton} style={styles.addButton} />
          </TouchableOpacity>
        </LinearGradient> */}
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  inboxData: state.inboxData,
  contacts: state.contacts,
  unread_status: state.unread_status,
  playerId: state.playerId,
}), mapDispatchToProps)(GhostScreen);
