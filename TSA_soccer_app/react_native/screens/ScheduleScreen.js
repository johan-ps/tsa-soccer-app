import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  FlatList,
  StatusBar,
  useWindowDimensions
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
import { Events } from '../data/events';
import Paginator from '../components/Schedule/Paginator';

const ScheduleScreen = ({ navigation }) => {
  const [renderScreen, setRenderScreen] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const theme = useSelector(state => state.theme.colors);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);


  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;


  return (
    <View style={{ backgroundColor: theme.cardBg }}>
      <View style={{backgroundColor: '#d4d4d4', height: 44}}/>
      <View style={{backgroundColor: '#d4d4d4', height: 150, width: '100%', position: 'absolute', top: 90, zIndex: 0}}/>
      {viewCalender ? (
        <View>
          <SafeAreaView>
            <ScheduleHeader
              onPress={() => setViewCalender(!viewCalender)}
              showDates={false}
            />
            <CalenderScreen />
          </SafeAreaView>
        </View>
      ) : (
        <View>
          <SafeAreaView>
            <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
              <ScheduleHeader onPress={() => setViewCalender(!viewCalender)} renderScreen={() => setRenderScreen(true)}/>
              {renderScreen ?
                <View>
                  <View style={[styles.bodyContainer, { backgroundColor: 'white'}]}>
                  <FlatList
                    contentContainerStyle={{ paddingVertical: 20 }}
                    data={Events}
                    renderItem={({ item }) => (
                      <ScheduleCard
                        item={item}
                        onPress={() => navigation.navigate('Event')}
                      />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={item => item.id}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                      { useNativeDriver: false },
                    )}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                  />
                  <View style={{ marginTop: 10 }}>
                    <Paginator
                      data={Events}
                      scrollX={scrollX}
                      currentIndex={currentIndex}
                    />
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
              :
              null
              }

            </View>
          </SafeAreaView>
        </View>
      )}
      {showAddButton && (
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  bodyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
