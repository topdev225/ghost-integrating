

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, FlatList, Text, RefreshControl } from 'react-native';
import Moment from 'react-moment';
import TimeAgo from 'react-native-timeago';
import Ripple from 'react-native-material-ripple';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';
// template
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import { contactBackground, ghostIcon, defaultPerson, inboxBottom } from '../../lib/image';
import * as Service from '../../service';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  dateView: {
    padding: 10,
    backgroundColor: Color.lightgray,
    color: Color.gray,
  },
  inboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Color.white,
  },
  inboxInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: getFontSize(18),
    color: Color.black,
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
    fontSize: getFontSize(16),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
    paddingBottom: dySize(10),
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
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: getFontSize(16),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
    marginTop: dySize(50),
  },
});


export class InboxView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isModalVisible: false,
    };
  }

  static propTypes = {
    toggleModal: PropTypes.func.isRequired,

  }

  static defaultProps = {

  }

  componentDidMount() {

  }

  _onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      setTimeout(() => {
        this.setState({ refreshing: false });
        this.props.toggleModal();
      });
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

  cutMsg = (msg) => {
    if (msg.length > 25) return `${msg.substr(0, 25)} ...`;
    return msg;
  }

  onPressInbox(inbox, labelName, photoURL) {
    this.props.setSelectedUserPhoto(photoURL);
    console.log('Inbox Data', inbox);
    NavigatorService.navigate('chat', {
      inbox,
      labelName,
    });
  }

  filterInbox = () => {
    const { current_did } = this.props;
    return _.filter(this.props.inboxData, (o) => o.did_id === current_did.did_id);
  }

  render() {
    const { inboxData } = this.props;
    console.log('Inbox array', inboxData);
    return (
      <FlatList
        data={this.filterInbox(inboxData)}
        renderItem={this._renderInboxItem.bind(this)}
        ListEmptyComponent={this._renderEmptyView.bind(this)}
        contentContainerStyle={{ paddingBottom: dySize(50) }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    );
  }

  _renderInboxItem({ item }) {
    // fetching Name and Photo
    const inbox = item;
    const contact = this.getMatchedContact(inbox.number);
    let labelName = inbox.number;
    if (contact.result !== 'Not Found') {
      labelName = Service.getContactName(contact);
    }
    let photoURL = defaultPerson;
    if (contact.thumbnailPath !== undefined && contact.thumbnailPath.length > 0) {
      photoURL = { uri: contact.thumbnailPath };
    }
    // Fetching unread message
    const badge = Number(inbox.unreadCount);

    // Filtering by Search Text
    // if (Service.beautifyPhoneFormat(labelName).toLowerCase().indexOf(this.state.searchText.toLowerCase()) < 0) return null;

    return (
      <View key={inbox.number}>
        <Text style={styles.dateView}>
          <Moment element={Text} >{inbox.updated_at * 1000}</Moment>
        </Text>
        <Ripple
          onPress={this.onPressInbox.bind(this, inbox, labelName, photoURL)}
          rippleColor={Color.purple}
          rippleDuration={300}
          rippleContainerBorderRadius={80}
          style={styles.inboxItem}
        >
          <View style={styles.inboxInfo}>
            <Text style={styles.name}>{Service.beautifyPhoneFormat(labelName)}</Text>
            <Text style={[styles.message, { fontWeight: badge > 0 ? 'bold' : 'normal' }]}>
              {this.cutMsg(Service.decodeMessage(inbox.message))}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.time}><TimeAgo time={inbox.updated_at * 1000} /></Text>
            {
              badge > 0 &&
              <View style={styles.badgeView}>
                <Text style={styles.badgeText}>{badge > 99 ? '99' : badge}</Text>
              </View>
            }
          </View>
        </Ripple>
      </View>
    );
  }

  _renderEmptyView = () => (
    <View style={styles.emptyView}>
      {!this.props.isLoading && <Text style={styles.emptyText}>No chat or call history to display</Text>}
    </View>
  )
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  inboxData: state.inboxData,
  contacts: state.contacts,
  unread_status: state.unread_status,
  settings: state.settings,
  isLoading: state.isLoading,
  current_did: state.current_did,
}), mapDispatchToProps)(InboxView);
