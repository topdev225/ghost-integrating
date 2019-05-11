

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearGradient from 'react-native-linear-gradient';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

import * as Color from '../../lib/color';
import * as Service from '../../service';
import { ActionCreators } from '../../redux/action';
import { dySize, getFontSize } from '../../lib/responsive';
import NavigatorService from '../../service/navigator';
import BubbleImage from './image';

const styles = StyleSheet.create({
  bubbleContainer: {
    paddingHorizontal: dySize(20),
    paddingVertical: dySize(5),
  },
  rightBubble: {
    alignItems: 'flex-end',
    paddingLeft: dySize(100),
  },
  leftBubble: {
    flexDirection: 'row',
    paddingRight: dySize(100),
    paddingLeft: dySize(60),
    position: 'relative',
  },
  dateText: {
    textAlign: 'center',
    fontSize: getFontSize(16),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  timeText: {
    fontSize: getFontSize(12),
    color: Color.gray,
    fontFamily: 'TitilliumWeb-light',
  },
  rightImageView: {
    borderRadius: dySize(10),
    borderTopRightRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
  },
  rightMsgText: {
    fontSize: getFontSize(16),
    color: Color.text,
    fontFamily: 'TitilliumWeb-Regular',
  },
  emojiText: {
    fontSize: getFontSize(16),
    marginHorizontal: dySize(2),
  },
  leftMsgText: {
    fontSize: getFontSize(16),
    color: Color.white,
    fontFamily: 'TitilliumWeb-Regular',
  },
  avatar: {
    position: 'absolute',
    top: dySize(5),
    left: 3,
    marginRight: dySize(10),
    borderRadius: dySize(24),
    resizeMode: 'stretch',
    width: dySize(48),
    height: dySize(48),
    overflow: 'hidden',
  },
  rightMsgView: {
    backgroundColor: Color.lightgray,
    borderRadius: dySize(10),
    borderTopRightRadius: 0,
    padding: dySize(10),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  leftMsgView: {
    borderRadius: dySize(10),
    borderTopLeftRadius: 0,
    overflow: 'hidden',
  },
  image: {
    width: dySize(200),
    height: dySize(200),
    resizeMode: 'cover',
  },
});

export class ChatBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  static propTypes = {
    message: PropTypes.object.isRequired,
    preMessage: PropTypes.object,
  }

  static defaultProps = {
    preMessage: undefined,
  }


  componentDidMount() {

  }

  onPressImage(message) {
    NavigatorService.navigate('preview_image', { message });
  }

  render() {
    const {
      preMessage, message, selected_photo,
    } = this.props;
    let preDate = '';
    let preTime = '';
    let PM = preMessage;
    if (preMessage !== undefined) {
      preDate = Service.convertChatDate(Number(preMessage.updated_at * 1000));
      preTime = Service.convertChatTime(Number(preMessage.updated_at * 1000));
    } else {
      PM = {
        sent: -1,
      };
    }
    const curDate = Service.convertChatDate(Number(message.updated_at * 1000));
    const curTime = Service.convertChatTime(Number(message.updated_at * 1000));
    if (message.sent === '1') {
      return (
        <View style={styles.bubbleContainer}>
          {preDate !== curDate && <Text style={styles.dateText}>{curDate}</Text>}
          <View style={styles.rightBubble}>
            {
              (
                preTime !== curTime ||
                preDate !== curDate ||
                PM.sent !== message.sent
              )
              && <Text style={styles.timeText}>{curTime}</Text>
            }

            {
              message.mms === '1' ?
                <View style={styles.rightImageView}>
                  <TouchableOpacity onPress={this.onPressImage.bind(this, message)}>
                    <BubbleImage url={message.message} />
                  </TouchableOpacity>
                </View>
              :
                <View style={styles.rightMsgView}>
                  <Text selectable style={styles.rightMsgText}>{Service.decodeMessage(message.message)}</Text>
                </View>
            }
          </View>
        </View>
      );
    }
    return (
      <View style={styles.bubbleContainer}>
        {preDate !== curDate && <Text style={styles.dateText}>{curDate}</Text>}
        <View style={styles.leftBubble}>
          {
            (PM.sent !== message.sent || preDate !== curDate) &&
            <Image
              source={selected_photo}
              indicator={ProgressBar}
              style={styles.avatar}
            />
          }
          <View>
            {
              (
                preTime !== curTime ||
                preDate !== curDate ||
                PM.sent !== message.sent
              )
              && <Text style={styles.timeText}>{curTime}</Text>
            }
            <View style={styles.leftMsgView}>
              {
                message.mms === '1' ?
                  <TouchableOpacity onPress={this.onPressImage.bind(this, message)}>
                    <BubbleImage url={message.message} />
                  </TouchableOpacity>
                :
                  <LinearGradient
                    colors={[Color.buttonDarkBlue, Color.buttonLightBlue]}
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 1.0, y: 0.0 }}
                  >
                    <View style={[styles.rightMsgView, { backgroundColor: 'transparent' }]}>
                      <Text selectable style={[styles.leftMsgText, { fontWeight: message.seen === '1' ? 'normal' : 'bold' }]}>
                        {Service.decodeMessage(message.message)}
                      </Text>
                    </View>
                  </LinearGradient>
              }
            </View>
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
  selected_photo: state.selected_photo,
}), mapDispatchToProps)(ChatBubble);
