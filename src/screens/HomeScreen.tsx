import React, { useState, useRef, useEffect } from 'react';

import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image,
  StatusBar, Animated, Alert, PermissionsAndroid, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { supabase } from '../helper/lib/supabase';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

// Navigation Type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const pinIcon = require('../assets/pin.png');
const threeDotsIcon = require('../assets/icons/threedots.png');

const icons = {
  createProfile: require('../assets/icons/profile.png'),
  viewProfiles: require('../assets/icons/switch_account.png'),
  mapMyPlaces: require('../assets/icons/pin.png'),
  settings: require('../assets/icons/settings.png'),
  logout: require('../assets/icons/logout.png'),
};

const HomeScreen = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [region, setRegion] = useState<Region | null>(null);
  const drawerAnimation = useRef(new Animated.Value(-250)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    let watchId: number;

    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );

          if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message: 'We need access to your location to show your position on the map.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('Permission Denied', 'Location permission is required to use the map feature.');
              return;
            }
          }
        }

        console.log("Watching location...");

        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 1000,
          distanceFilter: 0, // update on any change
        };

        watchId = Geolocation.watchPosition(
          (pos) => {
            const crd = pos.coords;
            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`Accuracy : ${crd.accuracy} meters.`);

            setRegion({
              latitude: crd.latitude,
              longitude: crd.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

            // Stop watching after one update if you only want to fetch once
            Geolocation.clearWatch(watchId);
          },
          (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            Alert.alert('Error', err.message || 'Failed to get current location. Make sure location is enabled.');
          },
          options
        );
      } catch (err) {
        console.warn('Location permission error:', err);
      }
    };

    requestLocationPermission();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);


  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleNavigation = async (screen: keyof RootStackParamList | 'Logout') => {
    toggleDrawer();

    if (screen === 'Logout') {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Logout Failed', error.message);
        return;
      }
      Alert.alert('Success', 'You have been logged out.');
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'DifferentSignup' }],
        });
      }, 200);
    } else {
      navigation.navigate(screen as any);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Show Map only when region is set */}
      {region && (
        <MapView
          style={StyleSheet.absoluteFillObject}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
        />
      )}

      {/* Search Box */}
      <View style={styles.topBarContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={pinIcon} style={styles.pinIcon} resizeMode="contain" />
          </TouchableOpacity>
          <TextInput placeholder="Search here" placeholderTextColor="#aaa" style={styles.searchInput} />
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileInitial}>V</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Button */}
      <TouchableOpacity onPress={toggleDrawer} style={styles.floatingMenu}>
        <Image source={threeDotsIcon} style={styles.threeDotsIcon} />
      </TouchableOpacity>

      {isDrawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}

      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnimation }] }]}>
        <Text style={styles.drawerTitle}>Menu</Text>
        {drawerOptions.map((item, index) => (
          <TouchableOpacity key={index} style={styles.drawerOption} onPress={() => handleNavigation(item.screen)}>
            <Image source={item.icon} style={styles.drawerIcon} />
            <Text style={styles.drawerText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const drawerOptions: { label: string; icon: any; screen: keyof RootStackParamList | 'Logout' }[] = [
  { label: 'Create Profile', icon: icons.createProfile, screen: 'Profile' },
  { label: 'View Profiles', icon: icons.viewProfiles, screen: 'ViewProfiles' },
  { label: 'Map My Places', icon: icons.mapMyPlaces, screen: 'MapMyPlaces' },
  { label: 'App Settings', icon: icons.settings, screen: 'HomeScreen' },
  { label: 'Logout', icon: icons.logout, screen: 'Logout' },
];


export default HomeScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  iconButton: {
    marginRight: 8,
  },
  pinIcon: {
    width: 20,
    height: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7b2cbf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingMenu: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  threeDotsIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  drawerContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#1e1e1e',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  drawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  drawerIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    tintColor: '#fff',
  },
  drawerText: {
    fontSize: 16,
    color: '#fff',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
