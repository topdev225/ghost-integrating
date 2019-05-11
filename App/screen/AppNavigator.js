import { StackNavigator } from 'react-navigation';

import Splash from './Splash';
// import Home from './Home';
import StepScreen from './Walkthrough';
import Welcome from './Walkthrough/welcome';
import SelectRegion from './Walkthrough/selectRegion';
import SelectNumber from './Walkthrough/selectNumber';
import Terms from './Walkthrough/terms';
import InboxScreen from './Inbox';
import ChatScreen from './Chat';
import PreviewImage from './Chat/preview';
import Profile from './Profile';
import EditProfile from './Edit/profile';
import EditNotification from './Edit/notification';
import EditAccount from './Edit/account';
import EditPrivacy from './Edit/privacy';
import ContactScreen from './Contacts';
import SupportScreen from './Support';
import SecretView from './Support/secret';
import Settings from './Settings';
import AddCredit from './Drawer/add-credit';
import GhostCallScreen from './Call';
import NewMessageScreen from './NewMessage';
import SelectPlan from './Drawer/select-plan';
import CreateGhost from './Drawer/create-ghost';
import CallScreen from './Call/call';
import CallReceiver from './Call/call-receiver';
import CallReceived from './Call/call-received';
import VerifyPhoneNumber from './Verify';

const MainNavigator = StackNavigator(
  {
    splash: { screen: Splash },
    // home: { screen: Home },
    step: { screen: StepScreen },
    welcome: { screen: Welcome },
    select_region: { screen: SelectRegion },
    select_number: { screen: SelectNumber },
    terms: { screen: Terms },
    verify: { screen: VerifyPhoneNumber },
    inbox: { screen: InboxScreen },
    chat: { screen: ChatScreen },
    contacts: { screen: ContactScreen },
    support: { screen: SupportScreen },
    setting: { screen: Settings },
    profile: { screen: Profile },
    edit_profile: { screen: EditProfile },
    edit_notification: { screen: EditNotification },
    edit_account: { screen: EditAccount },
    edit_privacy: { screen: EditPrivacy },
    // send_sms: { screen: SendSMS },
    // inbox_contact: { screen: InboxContact },
    preview_image: { screen: PreviewImage },
    add_credit: { screen: AddCredit },
    ghost_call: { screen: GhostCallScreen },
    new_message: { screen: NewMessageScreen },
    select_plan: { screen: SelectPlan },
    create_ghost: { screen: CreateGhost },
    call_screen: { screen: CallScreen },
    call_receiver: { screen: CallReceiver },
    call_received: { screen: CallReceived },
    secret: { screen: SecretView },
  },
  {
    headerMode: 'none',
  },
);

export default MainNavigator;
