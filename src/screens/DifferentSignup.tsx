import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { supabase } from '../helper/lib/supabase';
import GoogleSignInButton from '../components/GoogleSignInButton';

type DifferentSignupNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'DifferentSignup'
>;

type Props = {
  navigation: DifferentSignupNavigationProp;
};

const DifferentSignup: React.FC<Props> = ({ navigation }) => {
  const handleFacebookLogin = async () => {
    // Optional: log out to allow switching accounts
    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: Platform.OS === 'android'
          ? 'com.bizdectory://auth'
          : 'com.bizdectory://auth',
      },
    });

    if (error) {
      console.error('OAuth error:', error.message);
    } else if (data?.url) {
      await Linking.openURL(data.url);
    }
  };

  // Handle deep links when redirected back to app
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;

      if (url.startsWith('com.bizdectory://auth')) {
        // ✅ Wait for Supabase to complete auth session
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          console.log('Login was likely cancelled, no session exists.');
          return;
        }

        // ✅ Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (user && !userError) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (profile && !profileError) {
              navigation.replace('HomeScreen');
            } else {
              // User is logged in but no profile exists
              console.log('User is authenticated but needs to complete signup.');
            }
          } catch (e) {
            console.error('Profile lookup failed:', e);
          }
        } else {
          console.error('User fetch failed or login was cancelled:', userError);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url && url.startsWith('com.bizdectory://auth')) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../assets/login-bg.jpg')}
      style={styles.background}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <View style={styles.backButtonCircle}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>biz</Text>
        </View>
        <Text style={styles.logoTitle}>dectory</Text>
      </View>

      <View style={styles.buttonContainer}>
        <GoogleSignInButton navigation={navigation} />

        <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
          <Image source={require('../assets/facebook.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => navigation.navigate('SignupScreen')}
        >
          <Image source={require('../assets/gmail.png')} style={styles.icon} />
          <Text style={styles.buttonText}>Sign in with email</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonCircle: {
    backgroundColor: '#00C897',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    backgroundColor: 'yellow',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 50,
  },
  logoTitle: {
    fontSize: 50,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    elevation: 3,
    alignItems: 'center',
    marginVertical: 10,
  },
  facebookButton: {
    flexDirection: 'row',
    backgroundColor: '#1877F2',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    elevation: 3,
    alignItems: 'center',
    marginVertical: 10,
  },
  emailButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    padding: 15,
    width: '100%',
    borderRadius: 5,
    elevation: 3,
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default DifferentSignup;
