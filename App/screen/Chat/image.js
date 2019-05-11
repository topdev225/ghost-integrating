import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Image from 'react-native-image-progress';
import ImageResizer from 'react-native-image-resizer';
import ProgressBar from 'react-native-progress/Circle';
import RNFetchBlob from 'react-native-fetch-blob';
import { dySize } from '../../lib/responsive';

const styles = StyleSheet.create({
  image: {
    width: dySize(200),
    height: dySize(200),
    resizeMode: 'cover',
  },
  emptyView: {
    width: dySize(200),
    height: dySize(200),
  },
});

export default class BubbleImage extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      uri: 'none',
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', this.props.url)
    // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        // here's base64 encoded image
        // remove the file from storage
        Image.getSize(`data:image/jpeg;base64,${base64Data}`, (width, height) => {
          let rotate = 0;
          if (height > width && Platform.OS === 'android') {
            rotate = 90;
          }
          ImageResizer.createResizedImage(`data:image/jpeg;base64,${base64Data}`, 400, 600, 'JPEG', 60, rotate).then((response) => {
            this.setState({ uri: response.uri });
          }).catch((err) => {
            console.log(err.toString());
          });
        });
        return fs.unlink(imagePath);
      });
  }

  render() {
    const { uri } = this.state;

    if (uri === 'none') return <View style={styles.emptyView} />;
    return (
      <Image
        source={{ uri: this.state.uri }}
        indicator={ProgressBar}
        style={styles.image}
      />
    );
  }
}
