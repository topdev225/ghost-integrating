import React from 'react';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import Drawer from 'react-native-drawer';

import { ActionCreators } from '../redux/action';
import MainNavigator from './AppNavigator';
import NavigatorService from '../service/navigator';
import * as Color from '../lib/color';
import MyDrawer from './Drawer';

class AppWithNavigationState extends React.Component {
  _onSelectOption = (option) => {
    const { routeName } = this.props;
    this.props.setDrawerState(false);
    if (option === routeName) return;
    switch (option) {
      case 'inbox':
        NavigatorService.navigate('inbox');
        break;
      case 'contacts':
        NavigatorService.navigate('contacts');
        break;
      case 'do_not_disturb':
        break;
      case 'support':
        NavigatorService.navigate('support');
        break;
      case 'setting':
        NavigatorService.navigate('setting');
        break;
      case 'add_credit':
        NavigatorService.navigate('add_credit');
        break;
      case 'call_receiver':
        NavigatorService.navigate('call_receiver');
        break;
      case 'call_received':
        NavigatorService.navigate('call_received');
        break;
      case 'create_ghost':
        NavigatorService.navigate('create_ghost');
        break;
      case 'select_plan':
        NavigatorService.navigate('select_plan');
        break;
      case 'logout':
        break;
      default:
        break;
    }
  };

  render() {
    const { drawerOpened } = this.props;
    const drawerStyles = {
      drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
      main: { paddingLeft: 3 },
    };

    return (
      <View style={{ flex: 1 }}>
        <Drawer
          type="overlay"
          open={drawerOpened}
          content={<MyDrawer onSelectOption={(option) => this._onSelectOption(option)} />}
          onClose={() => this.props.setDrawerState(false)}
          tapToClose
          openDrawerOffset={0.2}
          panCloseMask={0.2}
          closedDrawerOffset={-3}
          styles={drawerStyles}
          tweenHandler={(ratio) => ({
            main: { opacity: (2 - ratio) / 2 },
          })}
        >
          <MainNavigator
            ref={navigatorRef => {
              NavigatorService.setContainer(navigatorRef);
            }}
            onNavigationStateChange={(prevState, currentState, action) => {
              console.log(action);
              const routeName = currentState.routes[currentState.index].routeName;
              this.props.setRouteName(routeName);
            }}
          />
        </Drawer>
        <Spinner visible={this.props.isLoading} color={Color.blue} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.isLoading,
  routeName: state.routeName,
  drawerOpened: state.drawerOpened,
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState);
