import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';

const ScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Schedule</Text>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    height: '100%',
  },
});

export default ScheduleScreen;
