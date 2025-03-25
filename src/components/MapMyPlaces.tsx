import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapMyPlaces = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map My Places Screen</Text>
    </View>
  );
};

export default MapMyPlaces;

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
