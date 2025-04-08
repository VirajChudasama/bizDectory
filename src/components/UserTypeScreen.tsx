import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { supabase } from '../helper/lib/supabase';

// Define the navigation type
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserTypeScreen'>;

// Define category type
interface Category {
  category_id: string;
  name: string;
}

const UserTypeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('user_categories').select('category_id, name');
        if (error) {
          Alert.alert('Error', 'Failed to fetch categories');
          return;
        }
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelection = async (category: Category) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        Alert.alert('Error', 'You must be logged in.');
        return;
      }

      const userId = data.user.id;
      await AsyncStorage.setItem(`selectedCategory_${userId}`, JSON.stringify(category));

      Alert.alert('Success', `${category.name} category selected!`);

      navigation.navigate('CreateProfile', {
        categoryId: category.category_id,  // Pass category_id to CreateProfile
      });
    } catch (error) {
      console.error('Error selecting category:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <ImageBackground source={require('../assets/login-bg.jpg')} style={styles.background}>
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

        {categories.map((category) => (
          <TouchableOpacity key={category.category_id} style={styles.button} onPress={() => handleCategorySelection(category)}>
            <Text style={styles.buttonText}>{category.name.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
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
  button: {
    backgroundColor: 'white',
    padding: 15,
    width: '80%',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default UserTypeScreen;
