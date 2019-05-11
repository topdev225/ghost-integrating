import Pusher from 'pusher-js/react-native';
import { Config } from './config';

export const pusher = new Pusher(
  Config.pusher_appKey,
  {
    cluster: Config.pusher_cluster,
  },
);

pusher.connection.bind('connected', () => {
  console.log('Pusher-js has been connected');
});
