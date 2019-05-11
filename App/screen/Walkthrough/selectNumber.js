

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, Alert, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import * as _ from 'lodash';

import { dySize, getFontSize } from '../../lib/responsive';
import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import * as Color from '../../lib/color';
import * as Service from '../../service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
  },
  topView: {
    marginTop: 20,
    padding: dySize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: getFontSize(20),
    color: Color.text,
  },
  topText: {
    fontSize: getFontSize(18),
    color: Color.text,
    marginLeft: 40,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  searchView: {
    width: dySize(315),
    height: dySize(36),
    backgroundColor: Color.lightgray,
    borderRadius: dySize(18),
    justifyContent: 'center',
    paddingLeft: dySize(20),
    paddingRight: dySize(40),
    marginTop: dySize(20),
  },
  searchIcon: {
    color: Color.white,
    fontSize: getFontSize(18),
  },
  searchBar: {
    width: dySize(300),
    padding: 0,
  },
  searchText: {
    fontSize: getFontSize(18),
    color: Color.text,
  },
  listView: {
    flex: 1,
  },
  listItem: {
    height: dySize(70),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: dySize(30),
  },
  listLeftView: {
    width: dySize(330),
    paddingHorizontal: dySize(20),
    justifyContent: 'center',
  },
  listNumber: {
    fontSize: getFontSize(16),
    color: Color.black,
    fontFamily: 'TitilliumWeb-Regular',
  },
  listText: {
    fontSize: getFontSize(16),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-Regular',
  },
  listIcon: {
    width: dySize(20),
    fontSize: getFontSize(18),
    color: Color.blue,
  },
  sectionText: {
    fontSize: getFontSize(24),
    color: Color.purple,
    paddingLeft: dySize(20),
    fontFamily: 'TitilliumWeb-Regular',
  },
  keyBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: dySize(24),
    backgroundColor: Color.white,
  },
  keyContent: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  rightKeyText: {
    padding: 8,
    fontSize: getFontSize(14),
    color: Color.blue,
  },
  headerView: {
    width: dySize(315),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: dySize(36),
    marginTop: dySize(30),
  },
  headerText: {
    fontSize: getFontSize(18),
    fontFamily: 'TitilliumWeb-Regular',
    color: Color.black,
  },
  headerIcon: {
    fontSize: getFontSize(18),
    color: Color.gray,
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
});

export class SelectNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentDidMount() {
    this.getKeyIndex();
  }

  getKeyIndex() {
    const keys = {};
    let index = 0;
    this.convertAvailableNumbers().map((item) => {
      keys[item.key] = index;
      index += 1;
      return index;
    });
    return keys;
  }

  convertAvailableNumbers() {
    // convert available numbers for sorting with keys
    const result = {};
    const { searchText } = this.state;
    this.props.availableNumbers.map((number) => {
      if (number.number.indexOf(searchText) < 0 && number.ratecenter.indexOf(searchText.toUpperCase()) < 0) return false;
      let keyString = number.ratecenter.substring(0, 1);
      keyString = keyString.toUpperCase();
      if (result[keyString] === undefined) {
        result[keyString] = [number];
      } else {
        result[keyString].push(number);
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

  buyNumber(number) {
    const param = {
      uuid: DeviceInfo.getUniqueID(),
      number,
      ghostName: this.props.navigation.state.params.name,
      packageNumber: '1',
    };
    this.props.buyNumber(param);
  }

  onPressNumber(number) {
    const GhostName = this.props.navigation.state.params.name;
    Alert.alert(
      '',
      `Please confirm that you'd like to buy ${Service.beautifyPhoneFormat(number.number)} as your Ghost Number  (${GhostName})`,
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.buyNumber(number.number);
          },
        },
      ],
      { cancelable: false },
    );
  }

  _renderItem = ({ item }) => (
    <View>
      <Text style={styles.sectionText}>{item.key}</Text>
      {
        item.list.map((number) => (
          <TouchableOpacity onPress={this.onPressNumber.bind(this, number)} key={number.id} style={styles.listItem}>
            <View style={styles.listLeftView}>
              <Text style={styles.listNumber}>{Service.beautifyPhoneFormat(number.number)}</Text>
              <Text style={styles.listText}>{number.ratecenter}, {number.state}</Text>
            </View>
            {/* <Icon name="ios-arrow-forward-outline" style={styles.listIcon} /> */}
          </TouchableOpacity>
        ))
      }

    </View>
  );

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
          this.convertAvailableNumbers().map((item) => (
            <TouchableOpacity key={item.key} onPress={this.onPressKey.bind(this, item.key)}>
              <Text style={styles.rightKeyText}>{item.key.toLowerCase()}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    );
  }

  render() {
    const { availableNumbers } = this.props;
    return (
      <View style={styles.container}>
        {/* <View style={styles.headerView}>
          <Text style={styles.headerText}>{myRegion.state}</Text>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="md-close" style={styles.headerIcon} />
          </TouchableOpacity>
        </View> */}
        <CustomHeader
          title="Available Numbers"
          leftIcon="ios-arrow-back"
          onPressLeft={() => NavigatorService.goBack()}
        />
        <View style={styles.searchView}>
          <View style={styles.searchIconView}>
            <Icon name="ios-search" style={styles.searchIcon} />
          </View>
          <TextInput
            placeholder="Search Number"
            onChangeText={(text) => { this.setState({ searchText: text }); }}
            placeholderTextColor={Color.gray}
            underlineColorAndroid="transparent"
            style={styles.searchBar}
            textStyle={styles.searchText}
            autoCorrect={false}
          />
        </View>
        <View style={styles.listView}>
          <FlatList
            ref={ref => this.listView = ref}
            style={{ marginTop: dySize(20) }}
            data={this.convertAvailableNumbers(availableNumbers)} // required array|object
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
  myRegion: state.myRegion,
  availableNumbers: state.availableNumbers,
}), mapDispatchToProps)(SelectNumber);
