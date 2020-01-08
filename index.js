import { AppRegistry, Platform } from 'react-native';
import App from './App';
import DB from "src/Models/Database";

AppRegistry.registerComponent('Spice', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('Spice', { rootTag });
}

DB.get();
(async () => {
  await DB.loadDummyData();
})();
