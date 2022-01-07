import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import * as eventActions from '../../store/actions/EventActions';
import * as loaderActions from '../../store/actions/LoaderActions';
import { UiImage } from '../_components';
import SwitchSelector from 'react-native-switch-selector';
import TeamListPreview from './TeamListPreview';

const EventDetails = props => {
  const { eventId } = props;
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const [event, setEvent] = useState({});
  const [availability, setAvailability] = useState([]);

  const options = [
    { label: 'Unavailable', value: 0 },
    { label: 'Going', value: 1 },
  ];

  const loadEventById = useCallback(
    async id => {
      try {
        dispatch(loaderActions.updateLoader(true));
        const event = await dispatch(eventActions.getEventById(id));
        setEvent(event.event[0]);
        setAvailability(event.availabilities);
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(loaderActions.updateLoader(false));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (eventId !== null) {
      loadEventById(eventId);
    }
  }, [dispatch, eventId, loadEventById]);

  return (
    <>
      <View style={styles.modalContainer}>
        <View style={styles.switchContainer}>
          <SwitchSelector
            hasPadding
            borderColor="#E41B23"
            buttonColor="#E41B23"
            options={options}
            onPress={value => console.log(`Call onPress with value: ${value}`)}
          />
        </View>
        <View style={styles.availabilityContainer}>
          <Text
            style={[
              styles.availability,
              { fontFamily: theme.fontRegular, color: theme.primaryText },
            ]}>
            <Text style={[{ fontFamily: theme.fontBold }]}>
              {availability.length}{' '}
            </Text>
            {availability.length === 1 ? 'person is' : 'people are'} going:
          </Text>
          <View>
            <View style={{ paddingLeft: 10 }}>
              <TeamListPreview players={availability} onPlusPress={() => {}} />
            </View>
            {/* <TeamAvailabilityPopup
              players={availability}
              visible={openAvailability}
              onClose={() => {
                setOpenAvailability(false);
              }}
            /> */}
          </View>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Text
            style={[
              styles.eventDetailsHeading,
              { fontFamily: theme.fontMedium, color: theme.primaryText },
            ]}>
            Description
          </Text>
          <Text
            style={[
              styles.eventDetails,
              { fontFamily: theme.fontRegular, color: theme.secondaryText },
            ]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
        <View style={styles.mainEventContent}>
          <View style={styles.timeContainer}>
            <View style={styles.iconContainer}>
              <Icon name="time-outline" size={24} color="#E41B23" />
            </View>
            <View style={styles.timeInnerContainer}>
              <Text
                style={[
                  styles.date,
                  {
                    fontFamily: theme.fontRegular,
                    color: theme.secondaryText,
                  },
                ]}>
                {moment.utc(event.date).format('MMMM D, YYYY')}
              </Text>
              <Text
                style={[
                  styles.time,
                  {
                    fontFamily: theme.fontMedium,
                    color: theme.secondaryText,
                  },
                ]}>
                {moment(event.startTime, 'HH:mm:ss').format('h:mm')} -{' '}
                {moment(event.endTime, 'HH:mm:ss').format('h:mm a')}
              </Text>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <View style={styles.iconContainer}>
              <Icon name="location-outline" size={24} color="#E41B23" />
            </View>
            <View style={styles.locationInnerContainer}>
              <Text
                style={[
                  styles.locationDetails,
                  {
                    fontFamily: theme.fontRegular,
                    color: theme.secondaryText,
                  },
                ]}>
                {event.street}, {event.city}, {event.province}
              </Text>
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
            </View>
          </View>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Text
            style={[
              styles.eventDetailsHeading,
              { fontFamily: theme.fontMedium, color: theme.primaryText },
            ]}>
            Location
          </Text>
          <View style={styles.mapContainer}>
            <Image
              style={styles.map}
              resizeMode="cover"
              source={require('../../assets/img/map.jpg')}
            />
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
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  availabilityContainer: {
    marginVertical: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  availability: {
    fontSize: 16,
  },
  switchContainer: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 30,
  },
  mapContainer: {
    marginTop: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 15,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    borderRadius: 18,
    height: 50,
    width: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDEFEF',
  },
  mainEventContent: {
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeInnerContainer: {
    marginLeft: 20,
  },
  date: {
    fontSize: 14,
  },
  time: {
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  locationInnerContainer: {
    marginLeft: 20,
  },
  locationName: {
    fontSize: 16,
  },
  locationDetails: {
    fontSize: 14,
  },
  eventDetailsContainer: {
    marginBottom: 25,
  },
  eventDetails: {
    fontSize: 14,
    lineHeight: 22,
  },
  eventDetailsHeading: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default EventDetails;
