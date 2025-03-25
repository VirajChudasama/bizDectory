import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';

// Components (New Screens)
import CreateProfile from '../components/CreateProfile';
import ViewProfiles from '../components/ViewProfiles';
import MapMyPlaces from '../components/MapMyPlaces';

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  SignupScreen: undefined;
  CreateProfile: undefined;
  ViewProfiles: undefined;
  MapMyPlaces: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="LoginScreen">
      <RootStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* Components added as screens */}
      <RootStack.Screen
        name="CreateProfile"
        component={CreateProfile}
        options={{ headerShown: true, title: 'Create Profile' }}
      />
      <RootStack.Screen
        name="ViewProfiles"
        component={ViewProfiles}
        options={{ headerShown: true, title: 'View Profiles' }}
      />
      <RootStack.Screen
        name="MapMyPlaces"
        component={MapMyPlaces}
        options={{ headerShown: true, title: 'Map My Places' }}
      />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
