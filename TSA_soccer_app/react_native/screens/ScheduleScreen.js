import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AddButton } from '../components/_components';
import ScheduleHeader from '../components/Schedule/ScheduleHeader';
import ScheduleCardSmall from '../components/Schedule/ScheduleCardSmall';
import { useSelector } from 'react-redux';
import { Events } from '../data/events';
import CalendarCard from '../components/Schedule/CalendarCard';

const ScheduleScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);

  return (
    <View style={{ backgroundColor: theme.cardBg }}>
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View
            style={[
              styles.container,
              styles.tabBarOffset,
              { backgroundColor: theme.cardBg },
            ]}>
            <ScheduleHeader
              onPress={() => {
                navigation.navigate('Calender');
              }}
            />
            <View>
              <View style={[styles.bodyContainer]}>
                {Events.map((event, i) => (
                  <View key={i} style={styles.calendarCardContainer}>
                    <CalendarCard item={event} key={i} />
                  </View>
                ))}
              </View>
              <Text
                style={[styles.subHeading, { color: theme.cardTextHeading }]}>
                Upcoming
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardListInnerContainer}>
                {Events.map((event, i) => (
                  <View key={i} style={{}}>
                    <ScheduleCardSmall
                      event={event}
                      onPress={() => navigation.navigate('Event')}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      {userData && userData.accessLevel > 0 && (
        <AddButton
          onPress={() => {
            navigation.navigate('CreateEvent');
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarCardContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tabBarOffset: {
    marginBottom: 75,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: '#414141',
    borderLeftWidth: 1,
    borderStyle: 'solid',
    marginLeft: 20,
    marginVertical: 20,
  },
  cardListInnerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 20,
  },
  notchOffsetContainer: {
    height: 70,
    zIndex: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
  },
});

export default ScheduleScreen;
