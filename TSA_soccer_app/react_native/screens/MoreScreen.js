import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';

const MoreScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>More</Text>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'red'
  }
});

export default MoreScreen;
