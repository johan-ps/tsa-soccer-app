import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { AddButton } from '../components/_components';
import CreateEvent from '../components/CreateEvent';

const ScheduleScreen = () => {
  const [createEvent, setCreateEvent] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schedule</Text>
      <AddButton
        onPress={() => {
          setCreateEvent(true);
        }}
      />
      <CreateEvent
        visible={createEvent}
        onClose={() => {
          setCreateEvent(false);
        }}
      />
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
    backgroundColor: 'grey',
  },
  text: {
    color: 'red',
  },
});

export default ScheduleScreen;
