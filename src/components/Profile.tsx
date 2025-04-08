import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../helper/lib/supabase';

// Define the navigation type
type RootStackParamList = {
  UserTypeScreen: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserTypeScreen'>;

interface ProfileData {
  profile_id: string;
  full_name: string;
  profession: string;
  profile_picture_url?: string;
}

const Profile = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profiles, setProfiles] = useState<ProfileData[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_id, full_name, profession, profile_picture_url');

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data || []);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profiles</Text>

      {/* Display list of profiles */}
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.profile_id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.profile_picture_url
                  ? { uri: item.profile_picture_url }
                  : require('../assets/icons/avatar.png')
              }
              style={styles.avatar}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{item.full_name}</Text>
              <Text style={styles.cardSubtitle}>{item.profession || 'No profession specified'}</Text>
            </View>
          </View>
        )}
      />

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UserTypeScreen')}
      >
        <Image source={require('../assets/icons/add.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});
