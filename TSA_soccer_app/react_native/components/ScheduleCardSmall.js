import { ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const ScheduleCardSmall = props => {
  const { onPress } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.touchableContainer, { backgroundColor: theme.primaryBg }]}
      underlayColor="#DDDDDD">
      <View>
        <View style={styles.container}>
          <View style={styles.availableIcon}>
            <Icon color="black" size={30} name="checkmark" />
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.infoHeaderContainer}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="calendar-sharp" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.infoTextTop}>15 May, 2021</Text>
                <Text style={styles.infoTextBottom}>Wednesday</Text>
              </View>
            </View>
            <View style={styles.infoHeaderContainer}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="time-outline" size={20} color="black" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.infoTextTop}>5:30 pm</Text>
                <Text style={styles.infoTextBottom}>- 6:30 pm</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.text}>Game</Text>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 200,
    width: '40%',
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 25,
    textAlign: 'left',
    padding: 20,
  },
  availableIcon: {
    borderRadius: 5,
    backgroundColor: '#4ce660',
    opacity: 0.9,
    width: 35,
    height: 35,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 20,
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingRight: 10,
    width: 150,
  },
  infoTextTop: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    color: 'black',
  },
  infoTextBottom: {
    fontSize: 12,
    color: '#ebe8e8',
    textAlign: 'left',
    color: 'black',
  },
});

export default ScheduleCardSmall;