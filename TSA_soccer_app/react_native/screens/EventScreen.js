import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import TeamListPreview from '../components/Schedule/TeamListPreview';
import TeamAvailabilityPopup from '../components/Schedule/TeamAvailabilityPopUp';
import AvailabilityMenu from '../components/Schedule/AvailabilityMenu';
import LottieView from 'lottie-react-native';
import { getEventById } from '../store/actions/EventActions';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
const windowHeight = Dimensions.get('window').height;

const EventScreen = ({ navigation, route }) => {
  const loadingLottieAnim = require('../assets/img/soccer-empty-state.json');
  const playersList = [
    {
      id: 0,
      name: 'Kyrie Irving',
      image:
        'https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg',
    },
    {
      id: 1,
      name: 'Fred Vanvleet',
      image:
        'https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTgwMzAwNzYzMjEyMjkzOTk2/usatsi_15834400_168390270_lowres-1.jpg',
    },
    {
      id: 2,
      name: 'Og Anunoby',
      image:
        'https://smartcdn.prod.postmedia.digital/torontosun/wp-content/uploads/2021/03/OGSUNS-scaled-e1616862876391.jpg?quality=100&strip=all',
    },
    {
      id: 3,
      name: 'Kyle Lowry',
      image:
        'https://www.si.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTY4MDA3MjExNzU3Njc1Nzkz/kyle_lowry_raptors_parade_jpg.jpg',
    },
    {
      id: 4,
      name: 'Kawhi Leonard',
      image: 'https://pbs.twimg.com/media/Dn3eeqBU0AI80LY.jpg',
      last: true,
    },
  ];

  const { eventId } = route.params;
  const [event, setEvent] = useState({});
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const [openAvailability, setOpenAvailability] = useState(false);
  const [outerScrollEnabled, setOuterScrollEnabled] = useState(true);
  const [innerScrollEnabled, setInnerScrollEnabled] = useState(false);
  const scrollAnim = useSharedValue(0);
  const [blurRadius, setBlurRadius] = useState(0);

  const loadEventById = useCallback(
    async id => {
      try {
        const event = await dispatch(getEventById(id));
        setEvent(event[0]);
        console.log(event[0]);
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch],
  );

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(false));
  });

  useEffect(() => {
    loadEventById(eventId);
  }, [dispatch, eventId, loadEventById]);

  const [region, setRegion] = useState();
  const [marker, setMarker] = useState();

  const onRegionChange = region => {
    setRegion(region);
  };

  const onScrollHandler = useAnimatedScrollHandler(nativeEvent => {
    scrollAnim.value = nativeEvent.contentOffset.y;
    if (
      Math.abs(
        nativeEvent.contentSize.height -
          nativeEvent.layoutMeasurement.height -
          nativeEvent.contentOffset.y,
      ) <= 0.5
    ) {
      if (!innerScrollEnabled) {
        runOnJS(setInnerScrollEnabled)(true);
        runOnJS(setBlurRadius)(5);
      }
    } else if (innerScrollEnabled) {
      runOnJS(setBlurRadius)(0);
      runOnJS(setInnerScrollEnabled)(false);
    }
  });

  const teamStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(scrollAnim.value, [0, 164], [0, -50]),
        },
      ],
    };
  });

  const typeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(scrollAnim.value, [0, 164], [0, -85]),
        },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: theme.secondaryBg }}>
      {event ? (
        <Animated.ScrollView
          onScroll={onScrollHandler}
          style={[styles.container, { backgroundColor: theme.secondaryBg }]}>
          <ImageBackground
            style={styles.eventBg}
            blurRadius={blurRadius}
            borderBottomLeftRadius={30}
            borderBottomRightRadius={30}
            source={require('../assets/img/event-bg.jpg')}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']}
              style={styles.contentContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="chevron-back-outline"
                  size={35}
                  onPress={() => navigation.goBack()}
                  color="white"
                />
                <AvailabilityMenu />
              </View>
              <View style={styles.headerContainer}>
                <View style={styles.dateContainer}>
                  <Animated.Text
                    style={[
                      styles.eventDate,
                      {
                        fontFamily: theme.fontMedium,
                        color: theme.primaryText,
                      },
                      teamStyle,
                    ]}>
                    U8 Markham Houseleague
                  </Animated.Text>
                </View>
                <Animated.Text
                  style={[
                    styles.eventHeading,
                    {
                      fontFamily: theme.fontMedium,
                      color: theme.primaryText,
                    },
                    typeStyle,
                  ]}>
                  {event && event.type}{' '}
                  {event && event.type === 'Game'
                    ? `vs. ${event.opponent}`
                    : null}
                </Animated.Text>
              </View>
            </LinearGradient>
          </ImageBackground>
          <ScrollView
            style={[
              styles.eventContentContainer,
              { height: windowHeight - 210 },
            ]}
            nestedScrollEnabled={true}
            scrollEnabled={innerScrollEnabled}
            contentContainerStyle={styles.scrollContainer}>
            <View style={styles.mainEventContent}>
              <View style={styles.timeContainer}>
                <Icon name="timer-outline" size={24} color="white" />
                <View style={styles.timeInnerContainer}>
                  <Text
                    style={[
                      styles.date,
                      {
                        fontFamily: theme.fontMedium,
                        color: theme.secondaryText,
                      },
                    ]}>
                    {moment.utc(event.date).format('MMMM D, YYYY')}
                  </Text>
                  <Text
                    style={[
                      styles.time,
                      {
                        fontFamily: theme.fontRegular,
                        color: theme.secondaryText,
                      },
                    ]}>
                    {moment(event.startTime, 'HH:mm:ss').format('h:mm')} -{' '}
                    {moment(event.endTime, 'HH:mm:ss').format('h:mm a')}
                  </Text>
                </View>
              </View>
              <View style={styles.locationContainer}>
                <Icon name="navigate-outline" size={24} color="white" />
                <View style={styles.locationInnerContainer}>
                  <Text
                    style={[
                      styles.locationName,
                      {
                        fontFamily: theme.fontMedium,
                        color: theme.secondaryText,
                      },
                    ]}>
                    {event.name}
                  </Text>
                  <Text
                    style={[
                      styles.locationDetails,
                      {
                        fontFamily: theme.fontRegular,
                        color: theme.secondaryText,
                      },
                    ]}>
                    {event.street}
                  </Text>
                  <Text
                    style={[
                      styles.locationDetails,
                      {
                        fontFamily: theme.fontRegular,
                        color: theme.secondaryText,
                      },
                    ]}>
                    {event.city}, {event.province} {event.postalCode}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.lineBreak, { borderColor: theme.secondaryText }]}
            />
            <View style={styles.eventDetailsContainer}>
              <Text
                style={[
                  styles.eventDetailsHeading,
                  { fontFamily: theme.fontMedium, color: theme.primaryText },
                ]}>
                Event Details
              </Text>
              <Text
                style={[
                  styles.eventDetails,
                  { fontFamily: theme.fontThin, color: theme.secondaryText },
                ]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
              <View style={styles.mapContainer}>
                {/* <MapView
                  style={styles.map}
                  region={{
                    latitude: parseInt(event.latitude, 10),
                    longitude: parseInt(event.longitude, 10),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  loadingEnabled={true}
                  loadingBackgroundColor="black"
                  userInterfaceStyle="dark"
                  mapPadding={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <Marker
                    key={1}
                    coordinate={{
                      latitude: parseInt(event.latitude, 10),
                      longitude: parseInt(event.longitude, 10),
                    }}
                    title={event && event.name}>
                    <Image
                      source={{
                        uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                      }}
                      style={{ height: 35, width: 35 }}
                    />
                  </Marker>
                </MapView> */}
              </View>
              <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                <TeamListPreview
                  players={playersList}
                  onPlusPress={() => setOpenAvailability(true)}
                />
              </View>
              <TeamAvailabilityPopup
                players={playersList}
                visible={openAvailability}
                onClose={() => {
                  setOpenAvailability(false);
                }}
              />
            </View>
            <View style={styles.eventDetailsContainer}>
              <Text
                style={[
                  styles.eventDetailsHeading,
                  { fontFamily: theme.fontMedium, color: theme.primaryText },
                ]}>
                Event Details
              </Text>
              <Text
                style={[
                  styles.eventDetails,
                  { fontFamily: theme.fontThin, color: theme.secondaryText },
                ]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
              <View style={styles.mapContainer}>
                {/* <MapView
                  style={styles.map}
                  region={{
                    latitude: parseInt(event.latitude, 10),
                    longitude: parseInt(event.longitude, 10),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  loadingEnabled={true}
                  loadingBackgroundColor="black"
                  userInterfaceStyle="dark"
                  mapPadding={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <Marker
                    key={1}
                    coordinate={{
                      latitude: parseInt(event.latitude, 10),
                      longitude: parseInt(event.longitude, 10),
                    }}
                    title={event && event.name}>
                    <Image
                      source={{
                        uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                      }}
                      style={{ height: 35, width: 35 }}
                    />
                  </Marker>
                </MapView> */}
              </View>
              <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                <TeamListPreview
                  players={playersList}
                  onPlusPress={() => setOpenAvailability(true)}
                />
              </View>
              <TeamAvailabilityPopup
                players={playersList}
                visible={openAvailability}
                onClose={() => {
                  setOpenAvailability(false);
                }}
              />
            </View>
            <View style={styles.eventDetailsContainer}>
              <Text
                style={[
                  styles.eventDetailsHeading,
                  { fontFamily: theme.fontMedium, color: theme.primaryText },
                ]}>
                Event Details
              </Text>
              <Text
                style={[
                  styles.eventDetails,
                  { fontFamily: theme.fontThin, color: theme.secondaryText },
                ]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
              <View style={styles.mapContainer}>
                {/* <MapView
                  style={styles.map}
                  region={{
                    latitude: parseInt(event.latitude, 10),
                    longitude: parseInt(event.longitude, 10),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  loadingEnabled={true}
                  loadingBackgroundColor="black"
                  userInterfaceStyle="dark"
                  mapPadding={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <Marker
                    key={1}
                    coordinate={{
                      latitude: parseInt(event.latitude, 10),
                      longitude: parseInt(event.longitude, 10),
                    }}
                    title={event && event.name}>
                    <Image
                      source={{
                        uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                      }}
                      style={{ height: 35, width: 35 }}
                    />
                  </Marker>
                </MapView> */}
              </View>
              <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                <TeamListPreview
                  players={playersList}
                  onPlusPress={() => setOpenAvailability(true)}
                />
              </View>
              <TeamAvailabilityPopup
                players={playersList}
                visible={openAvailability}
                onClose={() => {
                  setOpenAvailability(false);
                }}
              />
            </View>
          </ScrollView>
        </Animated.ScrollView>
      ) : (
        <View
          style={{
            height: '100%',
            transform: [{ rotate: '10deg' }],
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <LottieView
            style={styles.lottieView}
            autoPlay={true}
            source={loadingLottieAnim}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventContentContainer: {
    padding: 25,
  },
  scrollContainer: {
    // paddingBottom: 120,
  },
  mainEventContent: {
    paddingHorizontal: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeInnerContainer: {
    marginLeft: 10,
  },
  date: {
    fontSize: 16,
  },
  time: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
  },
  locationInnerContainer: {
    marginLeft: 10,
  },
  locationName: {
    fontSize: 16,
  },
  locationDetails: {
    fontSize: 14,
  },
  lineBreak: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderStyle: 'solid',
    marginVertical: 20,
  },
  eventDetailsContainer: {
    paddingHorizontal: 10,
  },
  eventDetails: {
    fontSize: 16,
    lineHeight: 22,
  },
  eventDetailsHeading: {
    fontSize: 24,
    marginBottom: 10,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  lottieView: {
    height: 200,
    width: '100%',
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
  },
  eventBg: {
    height: 350,
    width: '100%',
    overflow: 'hidden',
  },
  contentContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  eventHeading: {
    fontSize: 40,
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 20,
    marginBottom: 20,
  },
  mapContainer: {
    height: 140,
    width: '80%',
    margin: 20,
    marginLeft: 40,
    marginRight: 40,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  availabilityIconContainer: {
    borderRadius: 5,
  },

  // iconContainer: {
  //   marginVertical: 10,
  //   paddingHorizontal: 35,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: '100%',
  //   paddingTop: 40,
  // },
  // listHeading: {
  //   fontSize: 14,
  //   width: '100%',
  //   padding: 8,
  //   backgroundColor: '#F0F0F0',
  //   color: '#696969',
  // },
  // verticalLine: {
  //   width: 1,
  //   height: 100,
  //   backgroundColor: '#A9A9A9',
  //   marginTop: 40,
  //   marginLeft: 70,
  // },
  // profilePictureContainer: {
  //   borderRadius: 60,
  //   borderColor: 'red',
  //   borderWidth: 3,
  //   height: 120,
  //   width: 120,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   margin: 20,
  //   marginBottom: 10,
  //   backgroundColor: 'rgba(255, 0, 13, 0.1)',
  //   left: 20,
  // },
  // playerNameContainer: {
  //   flexDirection: 'column',
  //   width: '100%',
  //   left: 50,
  // },
  // playerFirstName: {
  //   fontSize: 40,
  //   fontWeight: '600',
  //   width: 150,
  // },
  // playerLastName: {
  //   fontSize: 40,
  //   color: '#A9A9A9',
  // },
  // infoHeaderContainer: {
  //   flexDirection: 'row',
  //   paddingTop: 25,
  //   paddingRight: 10,
  //   width: 150,
  // },
  // infoContainer: {
  //   flexDirection: 'row',
  //   paddingTop: 20,
  //   paddingRight: 10,
  //   width: 150,
  // },
  // infoTextTop: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   textAlign: 'left',
  //   color: 'white',
  // },
  // infoTextBottom: {
  //   fontSize: 12,
  //   color: '#ebe8e8',
  //   textAlign: 'left',
  // },
  // descriptionTextContainer: {
  //   paddingTop: 20,
  //   paddingLeft: 40,
  //   paddingRight: 40,
  // },
  // mapContainer: {
  //   height: 140,
  //   width: '80%',
  //   margin: 20,
  //   marginLeft: 40,
  //   marginRight: 40,
  // },
  // map: {
  //   ...StyleSheet.absoluteFillObject,
  //   borderRadius: 10,
  // },
  // availabilityIconContainer: {
  //   borderRadius: 5,
  // },
});

export default EventScreen;
