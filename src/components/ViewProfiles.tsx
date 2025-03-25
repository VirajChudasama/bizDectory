import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewProfiles = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>View Profiles Screen</Text>
    </View>
  );
};

export default ViewProfiles;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
