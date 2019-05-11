

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// template
import { ActionCreators } from '../../redux/action';
import * as Color from '../../lib/color';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';

const css = StyleSheet.create({
  h2: {
    color: '#111111BB',
    fontWeight: 'bold',
    fontSize: getFontSize(24),
    fontFamily: 'D-DIN-Bold',
  },
  p: {
    color: '#a9a9a9',
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-SemiBold',
  },
  div: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  termsScrollView: {
    flex: 1,
    marginTop: dySize(10),
    backgroundColor: 'white',
  },
  termsContent: {
    padding: dySize(20),
  },
});


export class Terms extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    this.props.loadTerms();
  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          onPressLeft={() => this.props.navigation.goBack()}
          leftIcon="ios-arrow-back"
          title="Terms of Services"
        />
        <ScrollView
          style={styles.termsScrollView}
          contentContainerStyle={styles.termsContent}
        >
          <HTMLView
            value={this.props.termsHTML}
            stylesheet={css}
            style={{ paddingBottom: 100 }}
          />
        </ScrollView>
      </View>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => ({
  userInfo: state.userInfo,
  termsHTML: state.termsHTML,
}), mapDispatchToProps)(Terms);
