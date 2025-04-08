import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type OnBoardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnBoard'>;

type Props = {
  navigation: OnBoardScreenNavigationProp;
};

const OnBoard: React.FC<Props> = ({ navigation }) => {
  return (
    <ImageBackground source={require('../assets/login-bg.jpg')} style={styles.background}>
      <View style={styles.overlay}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>biz</Text>
          </View>
          <Text style={styles.logoTitle}>dectory</Text>
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DifferentSignup')}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchScreen')}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
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
  button: {
    width: width * 0.8,
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#707070',
  },
});

export default OnBoard;
