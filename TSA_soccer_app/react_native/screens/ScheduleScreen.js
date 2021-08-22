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
import AnimScrollView from '../components/AnimScrollView';
const loadingLottieAnim = require('../assets/img/spinning-anim.json');

const ScheduleScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const onScrollHandler = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y <= 0) {
      if (!refreshEnabled) {
        setRefreshEnabled(true);
      }
    } else {
      if (refreshEnabled) {
        setRefreshEnabled(false);
      }
    }
  };

  return (
    <View style={{ backgroundColor: theme.cardBg }}>
      <ScrollView onScroll={onScrollHandler} style={styles.container}>
        <SafeAreaView>
          <View
            style={[
              styles.container,
              styles.tabBarOffset,
              { backgroundColor: theme.cardBg },
            ]}>
            <ScheduleHeader
              onPress={route => {
                navigation.navigate(route);
              }}
            />
            <View>
              <AnimScrollView
                scrollOffset={0}
                loadingLottieAnim={loadingLottieAnim}
                backgroundColor={theme.secondaryBg}
                enabled={refreshEnabled}
                onlyPullToRefresh={true}>
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
              </AnimScrollView>
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
    marginBottom: 20,
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
