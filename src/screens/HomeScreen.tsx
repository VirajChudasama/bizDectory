import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, 
  StatusBar, Image, Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator'; // Importing from RootNavigator

// Navigation Type
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Assets
const mapImage = require('../assets/map.png');
const pinIcon = require('../assets/pin.png');
const threeDotsIcon = require('../assets/icons/threedots.png');

// Icons
const icons = {
  createProfile: require('../assets/icons/profile.png'),
  viewProfiles: require('../assets/icons/switch_account.png'),
  mapMyPlaces: require('../assets/icons/pin.png'),
  settings: require('../assets/icons/settings.png'),
  logout: require('../assets/icons/logout.png'),
};

const HomeScreen = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-250)).current;
  const navigation = useNavigation<NavigationProp>();

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

  const handleNavigation = (screen: keyof RootStackParamList) => {
    toggleDrawer(); 
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Map Background */}
      <ImageBackground source={mapImage} style={styles.mapBackground} resizeMode="cover">
        {/* Top Bar: Menu, Search, Profile */}
        <View style={styles.topBarContainer}>
          {/* Three-Dot Menu */}
          <TouchableOpacity onPress={toggleDrawer} style={styles.hamburgerButton}>
            <Image source={threeDotsIcon} style={styles.threeDotsIcon} />
          </TouchableOpacity>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={pinIcon} style={styles.pinIcon} resizeMode="contain" />
            </TouchableOpacity>
            <TextInput placeholder="Search here" placeholderTextColor="#aaa" style={styles.searchInput} />
          </View>

          {/* Profile Button */}
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileInitial}>V</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Overlay when drawer is open */}
      {isDrawerOpen && <TouchableOpacity style={styles.overlay} onPress={toggleDrawer} />}

      {/* Left Side Drawer */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnimation }] }]}>
        <Text style={styles.drawerTitle}>Menu</Text>

        {/* Drawer Menu Items */}
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

// Drawer menu options
const drawerOptions: { label: string; icon: any; screen: keyof RootStackParamList }[] = [
  { label: 'Create Profile', icon: icons.createProfile, screen: 'CreateProfile' },
  { label: 'View Profiles', icon: icons.viewProfiles, screen: 'ViewProfiles' },
  { label: 'Map My Places', icon: icons.mapMyPlaces, screen: 'MapMyPlaces' },
  { label: 'App Settings', icon: icons.settings, screen: 'HomeScreen' }, // Placeholder for now
  { label: 'Logout', icon: icons.logout, screen: 'HomeScreen' }, // Placeholder for now
];

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
  },
  topBarContainer: {
    marginTop: 60,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  hamburgerButton: {
    padding: 12,
  },
  threeDotsIcon: {
    width: 28,
    height: 28,
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
