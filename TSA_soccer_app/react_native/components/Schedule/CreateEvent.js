import React, { useState, useRef, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Modal, ScrollView,Button, SafeAreaView, TouchableHighlight, Pressable, Animated, Easing, TouchableOpacity, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";

import {
  UiButton,
  UiDropdown,
  UiToggle,
  UiInput,
} from '../_components';
import UiTextArea from '../UiComponents/UiTextArea';
import EventLocation from './EventLocation';

const CreateEvent = props => {
  const { visible } = props;
  const theme = useSelector(state => state.theme.colors);
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
  const repeat = [
    {
      label: 'Every Monday',
      id: 0,
    },
    {
      label: 'Every Tuesday',
      id: 1,
    },
    {
      label: 'Every Wednesday',
      id: 2,
    },
    {
      label: 'Every Thursday',
      id: 3,
    },
    {
      label: 'Every Friday',
      id: 4,
    },
    {
      label: 'Every Saturday',
      id: 5,
    },
    {
      label: 'Every Sunday',
      id: 6,
    }];
  const [type, setType] = useState(false);
  const [location, setLocation] = useState(false);
  const [locationValue, setLocationValue] = useState('Please Select');
  const [date, setDate] = useState(null)
  const [startTime, setStartTime] = useState(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shadow, setShadow] = useState(null)
  const [timeTbd, setTimeTbd] = useState(false);
  const [notifyTeam, setNotifyTeam] = useState(true);
  const [arriveEarly, setArriveEarly] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const dateAnimation = useRef(new Animated.Value(0)).current;
  const startTimeAnimation = useRef(new Animated.Value(0)).current;

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

  const onPressInStartTime = () => {
    setShowStartTimePicker(true);
    Animated.spring(startTimeAnimation, {
      friction: 100,
      toValue: 100,
      duration: 100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false
    })
  }

  const onPressOutStartTime = () => {
    setShowStartTimePicker(false);
    Animated.spring(startTimeAnimation, {
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

  // TODO: Fix dot scroll feature to include space
  // TODO: Fix up create new event features (fix new location stuff, fix datatimepicker stuff, add different for game/practice/other)
  // TODO: Add full calender view functionality
  // TODO: Add infinite scroll in upcoming ? (FLATLIST VIEW IN REACT NATIVE)
  // TODO: FIX UIDropdown Multiselect to show what you select in the text
  // TODO: Fix UI for availability modal in event screen
  // TODO: Hook up schedule so that it takes in data and prints it
  // TODO: Make actions and reducer for events
  // TODO: Use Mock Data to fill schedule screen up
  // TODO: Add Scroll in EventScreen where image moves up!
  // TODO: Add edit and delete functionality

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
              <View style={{flexDirection: 'row', paddingBottom: 20}}>
                <TouchableOpacity onPress={() => setType('Game')} style={{flex: 1, alignItems: 'center', padding: 5, borderWidth: 1, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderColor: '#A9A9A9', backgroundColor: type === 'Game' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Game</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setType('Practice')} style={{flex: 1, alignItems: 'center', padding: 5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#A9A9A9', backgroundColor: type === 'Practice' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Practice</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setType('Other')} style={{flex: 1, alignItems: 'center', padding: 5, borderWidth: 1, borderBottomRightRadius: 10, borderTopRightRadius: 10, borderColor: '#A9A9A9', backgroundColor: type === 'Other' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Other</Text>
                </TouchableOpacity>
              </View>
              <UiInput
                placeholder="Title"
                borderTheme="underline"
                fontSize={18}
                style={{ marginBottom: 0 }}
              />
              <Text style={styles.formLabels}>Date</Text>
              {/* <DateTimePicker 
                      value={date || new Date()}
                      onChange={(event, selectedDate)  => {
                        const currentDate = selectedDate || date;
                        setDate(currentDate);
                      }}
                      mode={'date'}
                      style={{color: 'red'}}
                      display={'default'}
                      textColor={'red'}
                    /> */}
              <Pressable 
                onPress={() => {
                  if(!shadow){ onPressInDate(); setShadow(shadowStyle);} else{ onPressOutDate(); setShadow(null); }
                }} 
                style={[ifCircle, {marginBottom: 10}, showDatePicker && shadow]}
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
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50}}>
                <Text style={styles.optionLabels}>Time TBD</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={timeTbd} onChange={() => setTimeTbd(!timeTbd)}/>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Pressable 
                    onPress={() => {
                      if(!shadow){ onPressInStartTime(); setShadow(shadowStyle);} else{ onPressOutStartTime(); setShadow(null); }
                    }} 
                    style={[ifCircle, {marginBottom: 10}, showStartTimePicker && shadow]}
                  >
                    <View style={{flexDirection: 'column'}}>
                      <View style={[styles.dateContainer]}>
                        <Text style={{color: date ? 'black' : 'grey', shadowOpacity: 0, fontSize: 16}}>{date ? moment(date).format('dddd, D MMM YYYY') : 'Please Select'}</Text>
                        <View style={styles.iconContainer}>
                          <Icon color={showStartTimePicker ? '#e51b23' : '#A8A4B8'} name="calendar-outline" size={20} />
                        </View>
                      </View>
                      <Animated.View style={{height: startTimeAnimation, width: 200, paddingRight: 20}}>
                        { showStartTimePicker ?
                          <DatePicker
                            date={date || new Date()}
                            onDateChange={setDate}
                            mode={'time'}
                            minuteInterval={5}
                          />
                          :
                          null
                        }
                      </Animated.View>
                    </View>
                  </Pressable>
              </View>
              <Text style={styles.formLabels}>Location</Text>
              <TouchableOpacity onPress={onSelectLocation} style={[ifCircle, {marginBottom: 10}]}>
                <View style={[styles.dateContainer]}>
                  <Text style={{color: locationValue === 'Please Select' ? 'grey' : 'black', shadowOpacity: 0, fontSize: 16}}>{locationValue}</Text>
                  <View style={styles.iconContainer}>
                    <Icon color={showDatePicker ? '#e51b23' : '#A8A4B8'} name="location-outline" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
              <UiTextArea placeholder={'Location Details (Ex: Field #11 or Park in Lot #2)'} style={[ifCircle, {padding: 0}]}/>
              <Text style={styles.formLabels}>Team</Text>
              <UiDropdown
                modalOffsetY={80}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose Teams"
                size="large"
              />
              <View style={{marginTop: 10}}>
                <UiInput placeholder={'Opponent'} style={{height: 55}}/>
              </View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <UiInput placeholder={'Jersey'} style={{height: 55}}/>
              </View>
              <UiToggle labelLeft="Home" labelRight="Away" />
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, marginTop: 10}}>
                <Text style={styles.optionLabels}>Notify Team(s)</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={notifyTeam} onChange={() => setNotifyTeam(!notifyTeam)}/>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50}}>
                <Text style={styles.optionLabels}>Arrive Early</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={arriveEarly} onChange={() => setArriveEarly(!arriveEarly)}/>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50}}>
                <Text style={styles.optionLabels}>Cancelled</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={cancelled} onChange={() => setCancelled(!cancelled)}/>
                </View>
              </View>
              <Text style={styles.formLabels}>Repeat</Text>
              <UiDropdown
                options={repeat}
                multiselect={true}
                placeholder="Please Select"
                size="large"
              />
              <View style={[{flexDirection: 'column', marginTop: 20}]}>
                <Text style={styles.formLabels}>Extra Notes</Text>
                <UiTextArea placeholder={'(Ex: Don\'t forget to bring consent form.)'} style={ifCircle} height={90}/>
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
    fontSize: 16,
    marginTop: 10,
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
