import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PhotoView from 'react-native-photo-view';
import { Icon } from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Color from '../../lib/color.js';
import { ActionCreators } from '../../redux/action';


const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000BB',
    ...ifIphoneX({
      top: 50,
    }, {
      top: 20,
    }),
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    padding: 0,
    margin: 0,
    fontSize: 40,
    color: Color.white,
  },
  saveButton: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000BB',
    ...ifIphoneX({
      top: 50,
    }, {
      top: 20,
    }),
  },
});

class PreviewImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURL: 'none',
      message: this.props.navigation.state.params.message,
      isDownloading: false,
    };
  }

  componentDidMount() {
    const that = this;
    setTimeout(() => {
      that.setState({ imageURL: that.props.navigation.state.params.message.message });
    }, 500);
  }

  onPressSaveButton() {
    const { message, imageURL } = this.state;
    this.setState({ isDownloading: true });
    const dirs = RNFetchBlob.fs.dirs;
    const ext = imageURL.substr(imageURL.length - 3, 3);
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: `${dirs.DownloadDir}/ghostchat_${message.created_at}.${ext}`,
      fileCache: true,
    })
      .fetch('GET', imageURL, {
        // some headers ..
      })
      .progress((received, total) => {
        console.log('progress', received / total);
        this.setState({ progress: `${Math.floor(received / total * 100)}%` });
      })
      .then((res) => {
        if (res.respInfo.status === 200) alert(`Download Completed! Filepath is "${res.data}"`);
        this.setState({ isDownloading: false });
      })
      .catch((e) => {
        this.setState({ isDownloading: false });
        alert(e.toString());
      });
  }

  render() {
    const { isDownloading, progress } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <PhotoView
          source={{ uri: this.state.imageURL }}
          minimumZoomScale={1}
          maximumZoomScale={3}
          androidScaleType="centerInside"
          style={{ width: Width, height: Height, backgroundColor: 'black' }}
        />
        <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
          <Icon name="md-close" style={styles.closeButton} />
        </TouchableOpacity>
        {
          Platform.OS === 'android' &&
          <TouchableOpacity style={styles.saveButton} onPress={() => this.onPressSaveButton()}>
            { isDownloading || <Icon name="md-download" style={styles.closeButton} />}
            <Spinner textContent={progress} textStyle={{ color: 'white' }} visible={isDownloading} color={Color.white} />
          </TouchableOpacity>
        }
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  previewImage: state.previewImage,
}), mapDispatchToProps)(PreviewImage);
