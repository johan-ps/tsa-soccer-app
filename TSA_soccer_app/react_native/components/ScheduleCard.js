import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScheduleClock from './ScheduleClock';

const ScheduleCard = props => {
  const { onPress } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.touchableContainer, { backgroundColor: theme.primaryBg }]}
      underlayColor="#DDDDDD">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 180,
        }}>
        <ScheduleClock />
        <View style={styles.container}>
          <View style={{ flexDirection: 'row' }}>
            {/* <View style={{flexDirection: 'row', paddingLeft: 20, alignItems: 'center'}}>
            <Icon name="location-outline" size={20} color="black" />
            <View>
              <Text style={styles.infoTextTop}>Scotiabank Arena</Text>
              <View>
                <Text style={styles.infoTextBottom}>40 Bay St.</Text>
                <Text style={styles.infoTextBottom}>Toronto, ON</Text>
                <Text style={styles.infoTextBottom}>M5J 2X2</Text>
              </View>
            </View>
          </View> */}
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.text}>Game</Text>
            </View>
          </View>
          <View style={styles.availableIcon}>
            <Icon color="black" size={30} name="checkmark" />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 180,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  infoContainer: {
    flexDirection: 'row',
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

export default ScheduleCard;
