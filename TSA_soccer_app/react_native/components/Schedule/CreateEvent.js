import React, { useState, useRef, useReducer, useCallback } from 'react';
import { Text, View, StyleSheet, Modal, ScrollView,Button, SafeAreaView, TouchableHighlight, Pressable, Animated, Easing, TouchableOpacity, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons'
import moment from "moment";
import REPEATS from '../../constants/Constants'

import {
  UiButton,
  UiDropdown,
  UiToggle,
  UiInput,
} from '../_components';
import UiTextArea from '../UiComponents/UiTextArea';
import EventLocation from './EventLocation';

import * as eventActions from '../../store/actions/EventActions';
import RNDateTimePicker from '@react-native-community/datetimepicker';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    type: '',
    title: '',
    date: null,
    timeTbd: false,
    startTime: null,
    endTime: null,
    locationId: null,
    locationDetails: '',
    teamIds: [],
    opponent: '',
    jersey: '',
    homeOrAway: null,
    notifyTeam: true,
    arriveEarly: false,
    cancelled: false,
    repeats: [],
    extraNotes: ''
  },
  inputValidities: {
    type: true,
    title: true,
    date: true,
    timeTbd: true,
    startTime: true,
    endTime: true,
    locationId: true,
    locationDetails: true,
    teamIds: true,
    opponent: true,
    jersey: true,
    homeOrAway: true,
    notifyTeam: true,
    arriveEarly: true,
    cancelled: true,
    repeats: true,
    extraNotes: true
  },
  formIsValid: true,
};

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (let key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  } else {
    return formInit;
  }
};


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
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

  const onChange = useCallback(
    (inputId, inputValue, inputValidity) => {
      console.log("Joell input:", inputId, inputValue, inputValidity);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState],
  );


  const [location, setLocation] = useState(false);
  const [locationValue, setLocationValue] = useState('Please Select');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shadow, setShadow] = useState(null)
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

  const onReturnLocation = location => {
    setLocationValue(location.name);
    onChange('locationId', location.id, true);
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

  const createEventHandler = async () => {
    const {type, title, eventDate, timeTbd, startTime, endTime, locationId, authorId, teams, extraNotes, cancelled, notifyTeam, opponent, locationDetails, jersey, homeOrAway, arriveEarly, repeats} = formState.inputValues;
    await dispatch(
      eventActions.createEvent({
        type: type,
        title: title,
        eventDate: eventDate, 
        timeTbd: timeTbd,
        startTime: startTime,
        endTime: endTime, 
        locationId: locationId,
        locationDetails: locationDetails, 
        authorId: authorId,
        teams: teams,
        going: going, 
        maybe: maybe, 
        unavailable: unavailable,
        noResponse: noResponse,
        extraNotes: extraNotes,
        cancelled: cancelled,
        notifyTeam: notifyTeam,
        opponent: opponent,
        jersey: jersey,
        homeOrAway: homeOrAway,
        arriveEarly: arriveEarly,
        repeats: repeats
      }),
    );
    props.navigation.goBack();
    dispatchFormState({ type: 'reset' });
  };


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
                <TouchableOpacity onPress={() => onChange('type', 'Game', true)} style={{flex: 1, alignItems: 'center', padding: 5, borderWidth: 1, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderColor: '#A9A9A9', backgroundColor: formState.inputValues.type === 'Game' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Game</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onChange('type', 'Practice', true)} style={{flex: 1, alignItems: 'center', padding: 5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#A9A9A9', backgroundColor: formState.inputValues.type === 'Practice' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Practice</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onChange('type', 'Other', true)} style={{flex: 1, alignItems: 'center', padding: 5, borderWidth: 1, borderBottomRightRadius: 10, borderTopRightRadius: 10, borderColor: '#A9A9A9', backgroundColor: formState.inputValues.type === 'Other' ? 'red' : 'white'}}>
                  <Text style={{fontSize: 18, fontWeight: '500'}}>Other</Text>
                </TouchableOpacity>
              </View>
              <UiInput
                id="title"
                placeholder="Title"
                borderTheme="underline"
                fontSize={18}
                style={{ marginBottom: 0 }}
                onInputChange={onChange}
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
                    <Text style={{color: formState.inputValues.date ? 'black' : 'grey', shadowOpacity: 0, fontSize: 16}}>{formState.inputValues.date ? moment(formState.inputValues.date).format('dddd, D MMM YYYY') : 'Please Select'}</Text>
                    <View style={styles.iconContainer}>
                      <Icon color={showDatePicker ? '#e51b23' : '#A8A4B8'} name="calendar-outline" size={20} />
                    </View>
                  </View>
                  <Animated.View style={{height: dateAnimation, width: '100%', paddingRight: 20}}>
                    { showDatePicker ?
                      <DatePicker
                        date={formState.inputValues.date || new Date()}
                        onDateChange={(date) => onChange("date", date, true)}
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
                  <Switch value={formState.inputValues.timeTbd} onValueChange={(value) => onChange('timeTbd', value, true)}/>
                </View>
              </View>
              {!formState.inputValues.timeTbd ?
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <View style={{width: '50%', justifyContent: 'center'}}>
                    <Text style={styles.formLabels}>Start Time</Text>
                    <RNDateTimePicker 
                      mode={'time'}
                      display={'default'}
                      onChange={(event, date) => {
                        setStartTime(date);
                        onChange('startTime', moment(date).format('h:m'), true);
                      }}
                      value={startTime || new Date()}
                    />
                  </View>
                  <View style={{width: '50%', justifyContent: 'center'}}>
                    <Text style={styles.formLabels}>End Time</Text>
                    <RNDateTimePicker 
                      mode={'time'}
                      display={'default'}
                      onChange={(event, date) => {
                        setEndTime(date);
                        onChange('endTime', moment(date).format('h:m'), true);
                      }}
                      value={endTime|| new Date()}
                    />
                  </View>
              </View>
              :
              null
              }
              <Text style={styles.formLabels}>Location</Text>
              <TouchableOpacity onPress={onSelectLocation} style={[ifCircle, {marginBottom: 10}]}>
                <View style={[styles.dateContainer]}>
                  <Text style={{color: locationValue === 'Please Select' ? 'grey' : 'black', shadowOpacity: 0, fontSize: 16}}>{locationValue}</Text>
                  <View style={styles.iconContainer}>
                    <Icon color={showDatePicker ? '#e51b23' : '#A8A4B8'} name="location-outline" size={20} />
                  </View>
                </View>
              </TouchableOpacity>
              <UiTextArea placeholder={'Location Details (Ex: Field #11 or Park in Lot #2)'} style={[ifCircle, {padding: 0}]} id="locationDetails" onInputChange={onChange}/>
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
                <UiInput id="opponent" placeholder={'Opponent'} style={{height: 55}} onInputChange={onChange}/>
              </View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <UiInput id="jersey" placeholder={'Jersey'} style={{height: 55}} onInputChange={onChange}/>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, marginTop: 10}}>
                <Text style={styles.optionLabels}>Notify Team(s)</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={formState.inputValues.notifyTeam} onValueChange={(value) => onChange('notifyTeam', value, true)}/>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50}}>
                <Text style={styles.optionLabels}>Arrive Early</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={formState.inputValues.arriveEarly} onValueChange={(value) => onChange('arriveEarly', value, true)}/>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: 50}}>
                <Text style={styles.optionLabels}>Cancelled</Text>
                <View style={{alignItems: 'flex-end', width: '100%', position: 'absolute'}}>
                  <Switch value={formState.inputValues.cancelled} onValueChange={(value) => onChange('cancelled', value, true)}/>
                </View>
              </View>
              <Text style={styles.formLabels}>Repeat</Text>
              <UiDropdown
                options={REPEATS}
                multiselect={true}
                placeholder="Please Select"
                size="large"
              />
              <View style={[{flexDirection: 'column', marginTop: 20}]}>
                <Text style={styles.formLabels}>Extra Notes</Text>
                <UiTextArea placeholder={'(Ex: Don\'t forget to bring consent form.)'} style={ifCircle} height={90} onInputChange={onChange}/>
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
            onPress={() => createEventHandler()}
          />
        </View>
      </View>
      <EventLocation showLocation={location} closeLocation={() => setLocation(false)} onSelect={onReturnLocation}/>
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
