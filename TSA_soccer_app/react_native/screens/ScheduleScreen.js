import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  FlatList
} from 'react-native';
import { AddButton, UiButton } from '../components/_components';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ScheduleCard from '../components/Schedule/ScheduleCard';
import ScheduleHeader from '../components/Schedule/ScheduleHeader';
import moment from 'moment';
import ScheduleCardSmall from '../components/Schedule/ScheduleCardSmall';
import CalenderScreen from '../screens/CalendarScreen';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Events } from '../data/events'
import Paginator from '../components/Schedule/Paginator';

const ScheduleScreen = ({ navigation }) => {
  const [createEvent, setCreateEvent] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true)
  const theme = useSelector(state => state.theme.colors);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  console.log(Events);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={{ backgroundColor: theme.cardBg }}>
      {viewCalender ? (
        <View>
          <SafeAreaView>
            <ScheduleHeader onPress={() => setViewCalender(!viewCalender)} showDates={false}/>
            <View style={{marginTop: 20}}>
            <Calendar
              current={new Date()}
              style={styles.calender}
              onDayPress={(day) => {console.log('selected day', day)}}
              disableMonthChange={false}
              theme={{
                todayTextColor: 'red',
                selectedDayBackgroundColor: 'red',
                textDayFontSize: 20,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 15,
                backgroundColor: theme.cardBg,
                calendarBackground: theme.cardBg,
                arrowColor: 'red',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
              }}
              markingType={'period'}
              markedDates={{
                '2021-08-15': {marked: true, dotColor: 'red'},
                '2021-08-16': {marked: true, dotColor: 'red'},
                '2021-08-22': {startingDay: true, color: 'red', textColor: 'white'},
                '2021-08-23': {color: 'red', textColor: 'white', marked: true, dotColor: 'white'},
                '2021-08-24': {color: 'red', textColor: 'white'},
                '2021-08-25': {endingDay: true, color: 'red', textColor: 'white'}
              }}
            />
            </View>
          </SafeAreaView>
        </View>
      ) : (
        <View>
          <SafeAreaView>
            <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
              <ScheduleHeader onPress={() => setViewCalender(!viewCalender)} />
              <View style={styles.bodyContainer}>
                <FlatList 
                  data={Events} 
                  renderItem={({item}) => <ScheduleCard item={item} onPress={() => navigation.navigate('Event')} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  bounces={false}
                  keyExtractor={(item) => item.id}
                  onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {useNativeDriver: false} )}
                  scrollEventThrottle={32}
                  onViewableItemsChanged={viewableItemsChanged}
                  viewabilityConfig={viewConfig}
                  ref={slidesRef}
                />
                <View style={{marginTop: 10}}>
                <Paginator data={Events} scrollX={scrollX} currentIndex={currentIndex} />
                </View>
              </View>
              <Text
                style={[styles.subHeading, { color: theme.cardTextHeading }]}>
                Upcoming
              </Text>
              <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
                style={{
                  height: 200,
                  marginLeft: 20,
                  paddingTop: 20,
                  marginRight: 20,
                }}>
                {Events.map(event => (
                    <View
                    style={{
                      paddingRight: 20,
                    }}>
                    <ScheduleCardSmall
                      event={event}
                      setShowAddButton={setShowAddButton}
                      onPress={() => navigation.navigate('Event')}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </SafeAreaView>
        </View>
      )}
      { showAddButton &&
      <AddButton
        onPress={() => {
          navigation.navigate('CreateEvent');
        }}
      />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  calender: {
    height: '100%',
    width: 500,
    marginTop: 100,
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 20,
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
  calender: {
    height: '93%'
  }
});

export default ScheduleScreen;
