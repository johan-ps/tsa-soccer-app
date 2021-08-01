import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScheduleClock from './ScheduleClock';
import AvailabilityMenu from './AvailabilityMenu';

const ScheduleCard = props => {
  const { onPress } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.touchableContainer, {backgroundColor: theme.primaryBg}]}
      underlayColor="#DDDDDD" >
      <View style={{flexDirection: 'row', height: 180}}>
        <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <ScheduleClock />
        </View>
        <View style={styles.container}>
          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%'}}>
            <View style={styles.availableIcon}>
              <AvailabilityMenu />
            </View>
            <View style={{ flexDirection: 'column', height: '50%', width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                <View style={{ paddingRight: 5 }}>
                  <Icon name="location-outline" size={20} color="black" />
                </View>
                <View style={{ paddingRight: 10 }}>
                  <Text style={styles.infoTextTop} >ScotiaBank Arena</Text>
                </View>
              </View>
              <Text style={styles.text}>Practice</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

{/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

const styles = StyleSheet.create({
  touchableContainer: {
    height: 180,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '52%'
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 30,
    textAlign: 'left',
    marginBottom: 5
  },
  availableIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
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
