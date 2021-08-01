import { ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AvailabilityMenu from './AvailabilityMenu';

const ScheduleCardSmall = props => {
  const { onPress } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchableContainer, { backgroundColor: theme.primaryBg }]}
      underlayColor="#DDDDDD">
      <View>
        <View style={styles.container}>
          <View style={styles.availableIcon}>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-start', width: 60}}>
              <Text style={styles.infoTextTop} numberOfLines={1}>15 May</Text>
              <Text style={styles.infoTextBottom} numberOfLines={1}>Wed</Text>
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <AvailabilityMenu />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <View style={styles.infoHeaderContainer}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="time-outline" size={20} color="black" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.infoTextTop}>5:30 pm</Text>
                <Text style={styles.infoTextBottom}>- 6:30 pm</Text>
              </View>
            </View> */}
            <View style={{flexDirection: 'row'}}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="location-outline" size={20} color="black" />
              </View>
              <View style={{ width: 80 }}>
                <Text style={styles.infoTextTop} >ScotiaBank Arena</Text>
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 200,
    width: 130,
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'column',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 22,
    textAlign: 'left',
    padding: 20,
  },
  availableIcon: {
    width: '100%',
    width: 35,
    height: 35,
    margin: 20,
    flexDirection: 'row'
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
