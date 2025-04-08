import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

// Deep linking config
const linking = {
  prefixes: ['com.bizdectory://'], // This should match your AndroidManifest intent-filter scheme
  config: {
    screens: {
      HomeScreen: 'auth', // This means com.bizdectory://auth will route to HomeScreen
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
