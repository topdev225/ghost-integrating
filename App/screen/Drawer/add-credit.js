
/* jshint esversion: 6 *//* jshint node: true */
import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ActionCreators } from '../../redux/action';
import NavigatorService from '../../service/navigator';
import CustomHeader from '../../component/header';
import { dySize, getFontSize } from '../../lib/responsive';
import { gallery, settingBubble, settingCall, fireImage } from '../../lib/image';
import * as Color from '../../lib/color';
import { credits } from '../../lib/constants';
import * as RNIap from 'react-native-iap';

// const PaymentRequest = require('react-native-payments').PaymentRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  bottomLogo: {
    height: dySize(71),
    width: dySize(375),
    resizeMode: 'stretch',
  },
  logo: {
    resizeMode: 'stretch',
    width: dySize(12),
    height: dySize(12),
    alignSelf: 'center',
  },
  detail_view: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  remainView: {
    width: dySize(275),
    marginLeft: dySize(50),
    borderBottomWidth: 0.5,
    borderBottomColor: Color.gray,
    padding: dySize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainText: {
    color: Color.gray,
    fontSize: getFontSize(14),
    fontFamily: 'TitilliumWeb-Regular',
  },
  creditText: {
    color: Color.black,
    fontSize: getFontSize(16),
    fontFamily: 'TitilliumWeb-Regular',
  },
  creditText2: {
    color: Color.purple,
    fontSize: getFontSize(14),
    fontFamily: 'TitilliumWeb-Regular',
    flex: 1,
    alignSelf: 'center',
    paddingLeft: 5,
  },
  creditItemView: {
    flex: 1,
    paddingHorizontal: dySize(20),
  },
  creditItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: dySize(100),
  },
  creditAmountView: {
    width: dySize(30),
    height: dySize(30),
    backgroundColor: Color.lightgray,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dySize(15),
  },
  creditPriceView: {
    backgroundColor: Color.buttonLightBlue,
    height: dySize(30),
    borderRadius: dySize(15),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: dySize(10),
  },
  priceText: {
    color: Color.white,
    fontSize: getFontSize(14),
    fontFamily: 'TitilliumWeb-Regular',
  },
});

export class AddCredit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }

  goToTerms() {
    NavigatorService.navigate('terms');
  }

  continue() {
    NavigatorService.navigate('select_region');
  }

  onPurchase = (credit) => {
    this.props.setLoading(true);
    if (Platform.OS === 'ios') this.handleApplePay(credit);
    else this.handleAndriodPay(credit);
  }

  handleApplePay = async (credit) => {
    // const itemSkus = [credit.apple_id];
    // const products = await RNIap.getProducts(itemSkus);
    // alert(JSON.stringify(products))
    RNIap.buyProduct(credit.apple_id).then(purchase => {
      console.log('Apple Pay Result: ', purchase);
      this.props.setLoading(false);
      alert('Purchased successfully!');
    }).catch(err => {
      this.props.setLoading(false);
      // standardized err.code and err.message available
      alert(err.message);
    });
    this.props.setLoading(false);
  }

  handleAndriodPay = async (credit) => {
    this.props.setLoading(false);
    const itemSkus = [credit.google_id];
    try {
      const message = await RNIap.initConnection();
      console.log('Google Pay Connection: ', message);
      RNIap.buyProduct(itemSkus[0]).then(purchase => {
        console.log('Google Pay Result: ', purchase);
        alert('Purchased successfully!');
      }).catch(err => {
        console.warn(err); // standardized err.code and err.message available
        alert(err.message);
      });
      // console.log(`message = ${message}`);
      // const items = await RNIap.getProducts(itemSKus);
      // console.log(`items = ${items.length}`);
      // console.log(items);
      // this.props.storeInAppPurchaseList(items);
    } catch (err) {
      if (err.code === 'E_SERVICE_ERROR') alert('Please sign in through the Play Store');
      else alert(`error = ${err.message}`);
    }
    // this.props.setLoading(false);
    // const itemSkus = [ credit.google_id ]

    // // const products = await RNIap.getProducts(itemSkus);
    // // alert(JSON.stringify(products))

    // RNIap.initConnection().then(
    //       RNIap.buyProduct(itemSkus[0]).then(purchase => {
    //        alert('1')
    //       }).catch(err => {
    //         console.warn(err); // standardized err.code and err.message available
    //         alert(err.message);
    //       })
    // ).catch(err => {
    //   alert(err)
    // })
    RNIap.endConnection();
  }

  // handleApplePay = async (credit) => {
  //   try {
  //     const token = await stripe.paymentRequestWithNativePay(
  //       {
  //         currencyCode: 'USD',
  //         countryCode: 'US',
  //         // requiredBillingAddressFields: ['all'],
  //         // requiredShippingAddressFields: ['all'],
  //         shippingMethods: [
  //           {
  //             id: 'UrbnBulter',
  //             label: `${credit.amount} Credits`,
  //             detail: `Buy ${credit.amount} credits`,
  //             amount: credit.price.toFixed(2),
  //           },
  //         ],
  //         shippingType: 'shipping',
  //       },
  //       [
  //         {
  //           id: 'GhostChat',
  //           label: `${credit.amount} Credits`,
  //           detail: `Buy ${credit.amount} credits`,
  //           amount: credit.price.toFixed(2),
  //         },
  //       ],
  //     );
  //     await stripe.completeNativePayRequest();
  //     this.props.setLoading(false);
  //     alert('Apple Pay payment completed');
  //   } catch (error) {
  //     console.log('Apple Pay Error', error.message);
  //     this.props.setLoading(false);
  //     alert(error.message);
  //   }
  // }

  // handleAndriodPay = async (credit) => {
  //   const METHOD_DATA = [{
  //     supportedMethods: ['android-pay'],
  //     data: {
  //       supportedNetworks: ['visa', 'mastercard', 'amex'],
  //       currencyCode: 'USD',
  //       environment: 'TEST', // defaults to production
  //       paymentMethodTokenizationParameters: {
  //         tokenizationType: 'NETWORK_TOKEN',
  //         parameters: {
  //           publicKey: 'BAYL0OCY3g39kJuTOtlF09MUN4ET9lE0U6lKwOOfxO6BztdTaSfqC8FqTT9FrSifUFrjIDMZq84twvxYZaZrkRA=',
  //         },
  //       },
  //     },
  //   }];

  //   const DETAILS = {
  //     id: 'android-pay',
  //     displayItems: [
  //       {
  //         label: `${credit.amount} Credits`,
  //         amount: { currency: 'USD', value: credit.price.toString() },
  //       },
  //     ],
  //     total: {
  //       label: `${credit.amount} Credits`,
  //       amount: { currency: 'USD', value: credit.price.toString() },
  //     },
  //   };
  //   const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);
  //   paymentRequest.show()
  //     .then((paymentResponse) => {
  //       // Your payment processing code goes here
  //       this.props.setLoading(false);
  //       setTimeout(() => {
  //         alert(JSON.stringify(paymentResponse));
  //       }, 1000);
  //     })
  //     .catch((e) => {
  //       this.props.setLoading(false);
  //     });
  // }


  render() {
    return (
      <View style={styles.container}>
        <CustomHeader
          title="Add Credit"
          leftIcon="ios-arrow-back"
          rightIcon="md-menu"
          onPressLeft={() => NavigatorService.goBack()}
          onPressRight={() => this.props.setDrawerState(true)}
        />
        <View style={styles.remainView}>
          <Text style={styles.remainText}>
            You have
            <Text style={styles.creditText}> {this.props.userInfo.user[0].credits} credits </Text>
            remaining
          </Text>
        </View>
        <ScrollView style={{ marginVertical: 10 }}>
          <View style={styles.creditItemView}>
            {
              credits.map((credit) => (
                <TouchableOpacity style={{ marginVertical: 10 }} onPress={() => this.onPurchase(credit)}>
                  <View style={styles.creditItem}>
                    <View style={{ flex: 6 }}>
                      <Text style={styles.creditText}>{credit.name} :</Text>
                      <View style={styles.detail_view}>
                        <Image source={settingCall} style={styles.logo} />
                        <Text style={styles.creditText2}>{credit.call}</Text>
                      </View>
                      <View style={styles.detail_view}>
                        <Image source={settingBubble} style={styles.logo} />
                        <Text style={styles.creditText2}>{credit.text}</Text>
                      </View>
                      <View style={styles.detail_view}>
                        <Image source={gallery} style={styles.logo} />
                        <Text style={styles.creditText2}>{credit.picture}</Text>
                      </View>
                      <View style={styles.detail_view}>
                        <Image source={fireImage} style={styles.logo} />
                        <Text style={styles.creditText2}>{credit.auto}</Text>
                      </View>
                    </View>
                    <View style={[styles.creditPriceView, { flex: 1 }]}>
                      <Text style={styles.priceText}>${credit.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            }
          </View>
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
}), mapDispatchToProps)(AddCredit);
