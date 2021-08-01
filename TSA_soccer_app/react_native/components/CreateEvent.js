import React, { useState, useRef, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Modal, ScrollView, SafeAreaView, TouchableHighlight, Pressable, Animated, Easing, TouchableOpacity, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";

import {
  UiButton,
  UiDropdown,
  UiToggle,
  UiInput,
} from '../components/_components';
import UiTextArea from './UiTextArea';
import EventLocation from './EventLocation';

const CreateEvent = props => {
  const { visible } = props;
  const theme = useSelector(state => state.theme.colors);
  const startTime = [
    { id: 0, label: '01:00' },
    { id: 1, label: '02:00' },
    { id: 2, label: '03:00' },
    { id: 3, label: '04:00' },
    { id: 4, label: '05:00' },
    { id: 5, label: '06:00' },
    { id: 6, label: '07:00' },
    { id: 7, label: '08:00' },
    { id: 8, label: '09:00' },
    { id: 9, label: '10:00' },
    { id: 10, label: '11:00' },
    { id: 11, label: '12:00' },
  ];
  const endTime = [
    { id: 12, label: '01:00' },
    { id: 13, label: '02:00' },
    { id: 14, label: '03:00' },
    { id: 15, label: '04:00' },
    { id: 16, label: '05:00' },
    { id: 17, label: '06:00' },
    { id: 18, label: '07:00' },
    { id: 19, label: '08:00' },
    { id: 20, label: '09:00' },
    { id: 21, label: '10:00' },
    { id: 22, label: '11:00' },
    { id: 23, label: '12:00' },
  ];
  const teams = [
    {
      label: 'House League',
      id: 0,
      children: [
        {
          label: 'Markham House League',
          id: 10,
        },
        {
          label: 'Scarborough House League',
          id: 17,
        },
      ],
    },
    {
      label: 'Rep',
      id: 1,
      children: [
        {
          label: 'U14',
          id: 13,
        },
        {
          label: 'U11',
          id: 14,
        },
        {
          label: 'U10',
          id: 15,
        },
        {
          label: 'U9',
          id: 16,
        },
      ],
    },
  ];
  const [location, setLocation] = useState(false);
  const [locationValue, setLocationValue] = useState('Please Select');
  const [date, setDate] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shadow, setShadow] = useState(null)
  const [notifyTeam, setNotifyTeam] = useState(true);
  const [arriveEarly, setArriveEarly] = useState(false);
  const dateAnimation = useRef(new Animated.Value(0)).current;
  const locationAnimation = useRef(new Animated.Value(0)).current;

  const onPressInDate = () => {
    setShowDatePicker(true);
    Animated.spring(dateAnimation, {
      friction: 100,
      toValue: 220,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const onPressOutDate = () => {
    setShowDatePicker(false);
    Animated.spring(dateAnimation, {
      friction: 100,
      toValue: 0,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const onSelectLocation = () => {
    setLocation(true);
  }

  const dateAnimStyle = {
    transform: [
      {
        scaleY: dateAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.98],
        }),
      },
    ],
  };

  const ifCircle = {
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#A8A4B8',
    paddingHorizontal: 12,
    elevation: 2,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowOffset: { height: 2 },
    backgroundColor: 'white'
  };
  const shadowStyle = {
    borderColor: theme.primaryIconClr,
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white'}}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.formHeading}>Create an Event</Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              <UiInput
                placeholder="Title"
                borderTheme="underline"
                fontSize={18}
                style={{ marginBottom: 20 }}
              />
              <UiToggle labelLeft="Game" labelRight="Practice" />
              <Text style={styles.formLabels}>Date</Text>
              <Pressable 
                onPress={() => {
                  if(!shadow){ onPressInDate(); setShadow(shadowStyle);} else{ onPressOutDate(); setShadow(null); }
                }} 
                style={[ifCircle, {marginBottom: 10}, shadow]}
              >
                <View style={{flexDirection: 'column'}}>
                  <View style={[styles.dateContainer]}>
                    <Text style={{color: date ? 'black' : 'grey', shadowOpacity: 0, fontSize: 16}}>{date ? moment(date).format('dddd, D MMM YYYY') : 'Please Select'}</Text>
                    <View style={styles.iconContainer}>
                      <Icon color={showDatePicker ? '#e51b23' : '#A8A4B8'} name="calendar-outline" size={20} />
                    </View>
                  </View>
                  <Animated.View style={{height: dateAnimation, width: '100%', paddingRight: 20}}>
                    { showDatePicker ?
                      <DatePicker
                        date={date || new Date()}
                        onDateChange={setDate}
                        mode={'date'}
                      />
                      :
                      null
                    }
                  </Animated.View>
                </View>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <UiDropdown
                  modalOffsetY={305}
                  modalOffsetX={30}
                  options={startTime}
                  placeholder="Start"
                  size="small"
                />
                <UiDropdown
                  modalOffsetY={305}
                  modalOffsetX={30}
                  options={endTime}
                  placeholder="End"
                  size="small"
                />
              </View>
              <Text style={styles.formLabels}>Location</Text>
              <TouchableOpacity onPress={onSelectLocation} style={[ifCircle, {marginBottom: 10}, shadow]}>
                <View style={[styles.dateContainer]}>
                  <Text style={{color: locationValue === 'Please Select' ? 'grey' : 'black', shadowOpacity: 0, fontSize: 16}}>{locationValue}</Text>
                  <View style={styles.iconContainer}>
                    <Icon color={showDatePicker ? '#e51b23' : '#A8A4B8'} name="location-outline" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
              <Text style={styles.formLabels}>Team</Text>
              <UiDropdown
                modalOffsetY={80}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
              />
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, marginTop: 10}}>
                <Text style={styles.optionLabels}>Notify Team</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={notifyTeam} onChange={() => setNotifyTeam(!notifyTeam)}/>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, marginBottom: 10}}>
                <Text style={styles.optionLabels}>Arrive Early</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={arriveEarly} onChange={() => setArriveEarly(!arriveEarly)}/>
                </View>
              </View>
              <View style={[{flexDirection: 'column'}]}>
                <UiTextArea placeholder={'Extra Notes'} style={ifCircle}/>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <UiButton
            label="Cancel"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={() => props.navigation.goBack()}
          />
          <UiButton
            label="Create"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={() => {}}
          />
        </View>
      </View>
      <EventLocation showLocation={location} closeLocation={() => setLocation(false)} onSelect={(aValue) => setLocationValue(aValue)}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollviewContainer: {
    // width: '100%',
    // height: '100%',
    // backgroundColor: 'white',
  },
  modalContainer: {
    height: '100%',
    backgroundColor: '#F2F2F2'
  },
  modalContentContainer: {
    width: '100%',
    height: '93%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  modalHeader: {
    padding: 30,
  },
  modalBody: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 56,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 3,
    marginHorizontal: 10,
    // marginBottom: 56,
  },
  formHeading: {
    color: '#1E1E1E',
    fontSize: 24,
    fontWeight: '600',
    // textShadowOffset: {width: 2, height: 2},
    // textShadowRadius: 10,
    // textShadowColor: '#dadada',
  },
  formLabels: {
    color: '#A19EAE',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  optionLabels: {
    color: '#A19EAE',
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 12
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10
  }
});

export default CreateEvent;
