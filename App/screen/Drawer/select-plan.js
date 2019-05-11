

/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Card } from 'native-base';

import { ActionCreators } from '../../redux/action';
import CustomHeader from '../../component/header';
import NavigatorService from '../../service/navigator';
import { dySize, getFontSize } from '../../lib/responsive';
import * as Color from '../../lib/color';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightgray,
  },
  content: {
    flex: 1,
    paddingTop: dySize(20),
  },
  planText: {
    fontSize: getFontSize(20),
    paddingHorizontal: dySize(20),
    color: Color.purple,
    fontFamily: 'TitilliumWeb-Regular',
  },
  infoView: {
    paddingVertical: dySize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoTitle: {
    color: Color.blue,
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
    marginTop: dySize(20),
    paddingHorizontal: dySize(20),
  },
  infoValue: {
    color: Color.text,
    fontSize: getFontSize(14),
    fontFamily: 'TitilliumWeb-Regular',
  },
  creditWrapper: {
    backgroundColor: Color.white,
    borderRadius: dySize(24),
    marginVertical: dySize(10),
    overflow: 'hidden',
  },
  creditTitleView: {
    padding: dySize(25),
    backgroundColor: Color.buttonLightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creditTitle: {
    fontSize: getFontSize(20),
    color: Color.black,
    fontFamily: 'TitilliumWeb-Regular',
  },
  creditButton: {
    paddingHorizontal: dySize(25),
    paddingVertical: dySize(7),
    borderRadius: dySize(10),
    borderWidth: 1,
    borderColor: Color.purple,
    backgroundColor: Color.white,
  },
  creditButtonText: {
    fontSize: getFontSize(14),
    color: Color.purple,
    fontFamily: 'TitilliumWeb-Regular',
  },
  creditContent: {
    paddingHorizontal: dySize(30),
    paddingTop: dySize(30),
  },
  creditContentLine: {
    flexDirection: 'row',
    marginBottom: dySize(30),
  },
  creditContentLeft: {
    flex: 2,
  },
  creditContentRight: {
    flex: 3,
  },
  creditIcon: {
    color: Color.buttonLightBlue,
    fontSize: getFontSize(30),
  },
  creditText: {
    fontSize: getFontSize(14),
    color: Color.text,
    fontFamily: 'TitilliumWeb-Regular',
  },
  expireText: {
    color: Color.gray,
    fontSize: getFontSize(14),
    paddingHorizontal: dySize(20),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: dySize(5),
    marginHorizontal: dySize(-20),
    padding: dySize(20),
  },
  cardExpireText: {
    color: Color.gray,
    fontSize: getFontSize(14),
    marginTop: dySize(5),
  },
  cardHeader: {
    color: Color.black,
    fontSize: getFontSize(16),
  },
  cardIcon: {
    color: Color.gray,
    fontSize: getFontSize(20),
  },
  flameIcon: {
    fontSize: getFontSize(20),
    color: Color.blue,
    marginRight: dySize(10),
  },
  upgradeView: {
    marginTop: dySize(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upgradeText: {
    color: Color.blue,
    fontSize: getFontSize(20),
  },
});

export class SelectPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

  }

  onSelectCredit = () => {

  }

  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Select Ghost Type"
          leftIcon="ios-arrow-back"
          onPressLeft={() => NavigatorService.goBack()}
        />
        <View style={styles.content}>
          <Text style={styles.planText}>Your Plan: Subscription</Text>
          <Text style={styles.expireText}>Renews: Jan 30, 2019</Text>
          <Text style={styles.infoTitle}>AUTO-RENEWING LINES</Text>
          <Card style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeader}>Testty</Text>
              <Text style={styles.cardExpireText}>Unlimited Texts, calls and pictures</Text>
            </View>
            <Icon name="ios-arrow-forward" style={styles.cardIcon} />
          </Card>
          <Card style={styles.card}>
            <Icon name="md-flame" style={styles.flameIcon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeader}>Save Money and Add Lines</Text>
              <View style={styles.upgradeView}>
                <Text style={styles.cardExpireText}>Get More from Burner</Text>
                <Text style={styles.upgradeText}>UPGRADE</Text>
              </View>
            </View>
          </Card>
          <Text style={styles.infoTitle}>PREPAID LINES</Text>
          <Card style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeader}>503 Test</Text>
              <Text style={styles.cardExpireText}>Expires in 29 days</Text>
            </View>
            <Icon name="ios-arrow-forward" style={styles.cardIcon} />
          </Card>
          <Card style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardHeader}>My new Burner</Text>
              <Text style={styles.cardExpireText}>Expires in 5 days</Text>
            </View>
            <Icon name="ios-arrow-forward" style={styles.cardIcon} />
          </Card>
          {/* <View style={styles.creditWrapper}>
            <View style={styles.creditTitleView}>
              <Text style={styles.creditTitle}>Text-only Ghost</Text>
              <TouchableOpacity onPress={() => this.onSelectCredit()} style={styles.creditButton}>
                <Text style={styles.creditButtonText}>5 Credits</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.creditContent}>
              <View style={styles.creditContentLine}>
                <View style={styles.creditContentLeft}>
                  <Icon name="ios-text" style={styles.creditIcon} />
                  <Text style={styles.creditText}>250 texts</Text>
                </View>
                <View style={styles.creditContentRight}>
                  <Icon name="md-images" style={styles.creditIcon} />
                  <Text style={styles.creditText}>No Pictures</Text>
                </View>
              </View>
              <View style={styles.creditContentLine}>
                <View style={styles.creditContentLeft}>
                  <Icon name="md-call" style={styles.creditIcon} />
                  <Text style={styles.creditText}>No calls</Text>
                </View>
                <View style={styles.creditContentRight}>
                  <Icon name="md-flame" style={styles.creditIcon} />
                  <Text style={styles.creditText}>Auto-ghost in 30 days</Text>
                </View>
              </View>
            </View>
          </View> */}
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
}), mapDispatchToProps)(SelectPlan);
