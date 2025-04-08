import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import OnBoard from '../screens/OnBoard';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import DifferentSignup from '../screens/DifferentSignup';
import GoogleSignInButton from '../components/GoogleSignInButton';

// Components (New Screens)
import CreateProfile from '../components/CreateProfile';
import ViewProfiles from '../components/ViewProfiles';
import MapMyPlaces from '../components/MapMyPlaces';
import UserTypeScreen from '../components/UserTypeScreen';
import Profile from '../components/Profile';
import FacebookLoginButton from '../components/FacebookLoginButton';


export type RootStackParamList = {
  OnBoard: undefined;
  LoginScreen: undefined;
  HomeScreen: undefined;
  SignupScreen: undefined;
  UserTypeScreen: undefined;
  CreateProfile: { categoryId: string };
  Profile: undefined; 
  ViewProfiles: undefined;
  MapMyPlaces: undefined;
  SearchScreen: undefined;
  GoogleSignInButton: undefined;
  DifferentSignup: undefined;
  FacebookLoginButton: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <RootStack.Navigator initialRouteName="OnBoard">
      <RootStack.Screen name="OnBoard" component={OnBoard} options={{ headerShown: false }} />
      <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="DifferentSignup" component={DifferentSignup} options={{ headerShown: false }} />
      <RootStack.Screen name="GoogleSignInButton" component={GoogleSignInButton} options={{ headerShown: false }} />
      <RootStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="UserTypeScreen" component={UserTypeScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="CreateProfile" component={CreateProfile} options={{ headerShown: true, title: 'Create Profile' }} />
      <RootStack.Screen name="ViewProfiles" component={ViewProfiles} options={{ headerShown: true, title: 'View Profiles' }} />
      <RootStack.Screen name="MapMyPlaces" component={MapMyPlaces} options={{ headerShown: true, title: 'Map My Places' }} />
      <RootStack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: true, title: 'Search' }} />
      <RootStack.Screen name="Profile" component={Profile} options={{ headerShown: true, title: 'Profile' }} />
      <RootStack.Screen name="FacebookLoginButton" component={FacebookLoginButton} options={{ headerShown: false }} />
    </RootStack.Navigator>
  );
};

export default RootNavigator;
