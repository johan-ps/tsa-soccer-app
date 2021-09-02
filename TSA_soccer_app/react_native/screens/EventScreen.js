import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  Image,
  ScrollView,
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
  const [event, setEvent] = useState(null);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const [openAvailability, setOpenAvailability] = useState(false);

  const loadEventById = useCallback(
    async id => {
      try {
        const event = await dispatch(getEventById(id));
        setEvent(event[0]);
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    loadEventById(eventId);
  }, [dispatch, loadEventById]);

  const [region, setRegion] = useState();
  const [marker, setMarker] = useState();

  const onRegionChange = region => {
    setRegion(region);
  };

  return (
    <View style={{ backgroundColor: '#1E2630' }}>
      {event ? (
        <View style={styles.container}>
          <View>
            <ImageBackground
              style={styles.profilePicture}
              source={{
                uri: 'https://weaselsfc.com/wp-content/uploads/2020/03/light-sport-night-sunlight-soccer-darkness-934558-pxhere.com_-e1583360836579.jpg',
              }}>
              <View>
                <LinearGradient
                  colors={['rgba(41, 41, 41, 0.8)', 'transparent']}
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
                </LinearGradient>
                <View style={styles.headerContainer}>
                  <Text style={styles.text}>
                    {event && event.type}{' '}
                    {event && event.type === 'Game'
                      ? `vs. ${event.opponent}`
                      : null}
                  </Text>
                </View>
                <LinearGradient
                  colors={['transparent', 'rgba(41, 41, 41, 0.3)']}
                  style={styles.contentContainer}>
                  <View style={{ flexDirection: 'row', paddingLeft: 40 }}>
                    <View style={styles.infoHeaderContainer}>
                      <View style={{ paddingRight: 10 }}>
                        <Icon name="calendar-sharp" size={20} color="white" />
                      </View>
                      <View>
                        <Text style={styles.infoTextTop}>
                          {moment
                            .utc(event && event.date)
                            .format('DD MMMM, YYYY')}
                        </Text>
                        <Text style={styles.infoTextBottom}>
                          {moment.utc(event && event.date).format('dddd')}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[styles.infoHeaderContainer, { paddingLeft: 25 }]}>
                      <View style={{ paddingRight: 10 }}>
                        <Icon name="time-outline" size={20} color="white" />
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={styles.infoTextTop}>
                          {event &&
                            moment('May 15, 2021 ' + event.startTime).format(
                              'h:mm',
                            )}{' '}
                          pm
                        </Text>
                        <Text style={styles.infoTextBottom}>
                          -{' '}
                          {event &&
                            moment('May 15, 2021 ' + event.endTime).format(
                              'h:mm',
                            )}{' '}
                          pm
                        </Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </ImageBackground>
          </View>
          <ScrollView>
            <View style={styles.descriptionTextContainer}>
              <Text style={[styles.infoTextTop, { paddingBottom: 10 }]}>
                Notes
              </Text>
              <Text style={styles.infoTextBottom}>{event && event.notes}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 40,
                paddingRight: 40,
              }}>
              <View style={styles.infoContainer}>
                <View style={{ paddingRight: 10 }}>
                  <Icon name="shirt-outline" size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.infoTextTop}>
                    {event &&
                      event.jersey.charAt(0).toUpperCase() +
                        event.jersey.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.infoContainer}>
                <View style={{ paddingRight: 10 }}>
                  <Icon name="football-outline" size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.infoTextTop}>
                    {event && event.opponent}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.infoContainer,
                { width: '100%', paddingLeft: 40, paddingRight: 40 },
              ]}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="location-outline" size={20} color="white" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ paddingRight: 10, paddingBottom: 5 }}>
                  <Text style={styles.infoTextTop}>{event && event.name}</Text>
                </View>
                <View>
                  <Text style={styles.infoTextBottom}>
                    {event && event.street}
                  </Text>
                  <Text style={styles.infoTextBottom}>
                    {event && event.city}, {event && event.province}
                  </Text>
                  <Text style={styles.infoTextBottom}>
                    {event && event.postalCode}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: parseInt(event.latitude),
                  longitude: parseInt(event.longitude),
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
                    latitude: parseInt(event.latitude),
                    longitude: parseInt(event.longitude),
                  }}
                  title={event && event.name}>
                  <Image
                    source={{
                      uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                    }}
                    style={{ height: 35, width: 35 }}
                  />
                </Marker>
              </MapView>
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
          </ScrollView>
        </View>
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E2630',
  },
  lottieView: {
    height: 200,
    width: '100%',
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
  },
  headerContainer: {
    paddingLeft: 40,
    paddingTop: 100,
  },
  text: {
    fontSize: 30,
    color: 'white',
    fontWeight: '600',
  },
  iconContainer: {
    marginVertical: 10,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: 40,
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0',
    color: '#696969',
  },
  verticalLine: {
    width: 1,
    height: 100,
    backgroundColor: '#A9A9A9',
    marginTop: 40,
    marginLeft: 70,
  },
  profilePicture: {
    height: 300,
    width: '100%',
    backgroundColor: 'transparent',
  },
  profilePictureContainer: {
    borderRadius: 60,
    borderColor: 'red',
    borderWidth: 3,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 0, 13, 0.1)',
    left: 20,
  },
  playerNameContainer: {
    flexDirection: 'column',
    width: '100%',
    left: 50,
  },
  playerFirstName: {
    fontSize: 40,
    fontWeight: '600',
    width: 150,
  },
  playerLastName: {
    fontSize: 40,
    color: '#A9A9A9',
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingRight: 10,
    width: 150,
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
    color: 'white',
  },
  infoTextBottom: {
    fontSize: 12,
    color: '#ebe8e8',
    textAlign: 'left',
  },
  descriptionTextContainer: {
    paddingTop: 20,
    paddingLeft: 40,
    paddingRight: 40,
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
  contentContainer: {
    // flex : 1,
    // paddingTop: 50,
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    overflow: 'visible',
    alignSelf: 'stretch',
  },
  availabilityIconContainer: {
    borderRadius: 5,
  },
});

export default EventScreen;
