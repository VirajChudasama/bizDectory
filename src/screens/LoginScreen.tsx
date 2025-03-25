import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { loginUser } from '../api/services/authService';
import { RootStackParamList } from '../navigation/RootNavigator'; // adjust the path!

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const userData = await loginUser(email, password);
      console.log('Login success:', userData);
      Alert.alert('Login Successful!');

      navigation.replace('HomeScreen');
    } catch (error: any) {
      console.error('Login error:', error.message);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

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

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>biz</Text>
          </View>
          <Text style={styles.logoTitle}>dectory</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="EMAIL"
            placeholderTextColor="#333"
            autoCapitalize="none"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="PASSWORD"
            placeholderTextColor="#333"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>LOGIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignupScreen')}
            style={{ marginTop: 15 }}
          >
            <Text style={{ color: '#fff' }}>
              Don't have an account? <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    elevation: 3,
  },
  loginButton: {
    backgroundColor: '#00C897',
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
    borderRadius: 5,
    elevation: 3,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
