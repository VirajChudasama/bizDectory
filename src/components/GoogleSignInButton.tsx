import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '../helper/lib/supabase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
};

export default function GoogleSignInButton({ navigation }: Props) {
  GoogleSignin.configure({
    webClientId: '359413533333-nkia0ap7qaivqmb8ejc85injgtnf3kmd.apps.googleusercontent.com',
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Force account picker

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken ?? userInfo?.data?.idToken;

      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          console.error('Supabase login error:', error.message);
        } else {
          // ✅ Login successful, now navigate
          navigation.replace('HomeScreen');
        }
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Sign-in error:', error);
      }
    }
  };

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={handleGoogleSignIn}
    />
  );
}
