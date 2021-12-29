import React, {
  useState,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatTeams } from '../../Util/utilities';
import UiDatePicker from '../UiComponents/UiDatePicker'
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import constants from '../../constants/Constants';
import { updateVisibility } from '../../store/actions/TabbarActions';
import { useFocusEffect } from '@react-navigation/native';
import { UiButton, UiDropdown, UiToggle, UiInput } from '../_components';
import EventLocation from './EventLocation';
import * as eventActions from '../../store/actions/EventActions';
import * as teamActions from '../../store/actions/TeamActions';
import * as loaderActions from '../../store/actions/LoaderActions'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ErrorMessage from '../UiComponents/ErrorMessage';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    type: '',
    date: null,
    timeTBD: false,
    startTime: null,
    endTime: null,
    locationId: null,
    locationDetails: '',
    authorId: null,
    notes: '',
    status: 'approved',
    notifyTeam: true,
    opponent: '',
    jersey: '',
    arriveEarly: false,
    teamId: null, 
  },
  inputValidities: {
    type: true,
    date: true,
    timeTBD: true,
    startTime: true,
    endTime: true,
    locationId: true,
    locationDetails: true,
    authorId: true,
    notes: true,
    status: true,
    notifyTeam: true,
    opponent: true,
    jersey: true,
    arriveEarly: true,
    teamId: true,
  },
  errors: {
    type: null,
    date: null,
    timeTBD: null,
    startTime: null,
    endTime: null,
    locationId: null,
    locationDetails: null,
    authorId: null,
    notes: null,
    status: null,
    notifyTeam: null,
    opponent: null,
    jersey: null,
    arriveEarly: null,
    teamId: null,
  },
  formIsValid: true,
};

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = { ...state.inputValues };
    if (action.value !== undefined) {
      updatedValues[action.input] = action.value;
    }

    const updatedValidities = { ...state.inputValidities };
    if (action.isValid !== undefined) {
      updatedValidities[action.input] = action.isValid;
    }

    const updatedErrors = { ...state.errors };
    if (action.error !== undefined) {
      updatedErrors[action.input] = action.error;
    }

    let updatedFormIsValid = true;
    for (let key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      errors: updatedErrors,
    };
  } else {
    return formInit;
  }
};

// TODO: Add repeating event functionality
// TODO: Add dropdown functionality for teams and repeating
// TODO: Add error handling
// TODO: fix reload of new event availability?
// TODO: fix update immiedietly for create event
// TODO: reload bug when scroll down and back up

const CreateEvent = props => {
  const { REPEATS } = constants;
  const { visible, route } = props;
  const { type, selectedDate, event } = route.params;
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const userId = userData && userData.id;
  const unformattedTeams = useSelector(state => state.teams);
  const teams = unformattedTeams && formatTeams(unformattedTeams);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);
  const [initTeam, setInitTeam] = useState([]);

  useFocusEffect(() => {
    dispatch(updateVisibility(false));
  });

  useEffect(() => {
    console.log("Joell event", event);
    onChange('authorId', userId, true);
    setStartTime(new Date());
    onChange('startTime', moment(new Date(), 'hh:mm A').format('HH:mm'), true);
    setEndTime(new Date(moment().add(2, 'hours')));
    onChange('endTime', moment().add(2, 'hours').format('HH:mm'), true);
    if(event != null){
      let keys = Object.keys(event);
      for(let key of keys){
        if(event[key]){
          onChange(key, event[key], true);
        }
      }
      if(event.locationId != null){
        setLocationValue(event.name);
      }
      if(event.startTime != null && event.endTime != null){
        setStartTime(new Date(moment(moment(event.date).format('YYYY-MM-DD') + " " + (event.startTime.length != 8 ? "0" : "") + event.startTime)));
        setEndTime(new Date(moment(moment(event.date).format('YYYY-MM-DD') + " " + (event.endTime.length != 8 ? "0" : "") + event.endTime)));
      }
      if(event.teamId != null){
        setInitTeam([event.teamId]);
      }
    }else if(type === 'Game'){
      onChange('type', 'Game', true);
    } else if (type === 'Practice') {
      onChange('type', 'Practice', true);
    }
  }, []);

  const onChange = useCallback(
    (inputId, inputValue, inputValidity) => {
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
  const [locationValue, setLocationValue] = useState('Choose Location');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [doesRepeat, setDoesRepeat] = useState(false);
  const [repeatEndDate, setRepeatEndDate] = useState(false);
  const [repeatDays, setRepeatDays] = useState([]);

  const loadTeams = useCallback(async () => {
    try {
      await dispatch(teamActions.getTeams());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);


  const onSelectLocation = () => {
    setLocation(true);
  };

  const onReturnLocation = location => {
    setLocationValue(location.name);
    onChange('locationId', location.id, true);
  };

  const createEventHandler = async () => {
    dispatch(loaderActions.updateLoader(true));
    try{
      await dispatch(
        eventActions.createEvent({
          ...formState.inputValues,
          date: formState.inputValues.date ? moment(formState.inputValues.date).format('YYYY-MM-DD') : null,
          teamId: Number.isInteger(formState.inputValues.teamId) ? formState.inputValues.teamId : null
        }),
      );
      // loadEventsFromDate(selectedDate);
      props.navigation.goBack();
      dispatchFormState({ type: 'reset' });
    }
    catch (error) {
      if (error) {
        error.forEach(err => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            isValid: false,
            error: err.errCode,
            input: err.field,
          });
        });
      }
    } finally {
      dispatch(loaderActions.updateLoader(false));
    }
  };

  const loadEventsFromDate = useCallback(
    async date => {
      try {
        await dispatch(
          eventsActions.getEventsFromDate(moment(date).format('YYYY-MM-DD'), userId),
        );
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch],
  );

  const onSelectHandler = useCallback(inputValue => {
    if (inputValue) {
      onChange('teamId', inputValue, true);
    }
  }, []);

  // TODO: Add full calender view functionality
  // TODO: Add infinite scroll in upcoming ? (FLATLIST VIEW IN REACT NATIVE)
  // TODO: FIX UIDropdown Multiselect to show what you select in the text
  // TODO: Fix UI for availability modal in event screen
  // TODO: Add Scroll in EventScreen where image moves up!
  // TODO: Add edit and delete functionality
  return (
    <SafeAreaView style={{ backgroundColor: theme.secondaryBg }}>
      <KeyboardAvoidingView
        behavior="position"
        style={{ backgroundColor: theme.secondaryBg }}>
      <View style={[styles.modalContainer, { backgroundColor: theme.secondaryBg }]}>
        <View style={[styles.modalContentContainer, { backgroundColor: theme.secondaryBg }]}>
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.formHeading,
                { color: theme.primaryText, fontFamily: theme.fontRegular },
              ]}>
              {event ? 'Edit' : 'Create a'}{type === 'Other' ? `n ${type}` : ` ${type}`} Event
            </Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              {type === 'Other' ? (
                <View style={{marginBottom: 20}}>
                  <UiInput
                    id="type"
                    placeholder="Title"
                    bg={theme.inputBg}
                    style={{marginTop: 20}}
                    color={theme.inputText}
                    placeholderClr={theme.inputPlaceholder}
                    onInputChange={onChange}
                    isValid={formState.inputValidities.type}
                    errCode={formState.errors.type}
                  />
                </View>
              ) : null}
              <Text style={styles.formLabels}>Date</Text>
              <View style={styles.marginTop}>
                <UiDatePicker
                  id="date"
                  placeholder={
                    formState.inputValues.date
                      ? moment(formState.inputValues.date).format(
                          'dddd, D MMM YYYY',
                        )
                      : 'Choose Date'
                  }
                  onChange={(id, date) => onChange(id, date, true)}
                  height={300}
                  isValid={formState.inputValidities.date}
                  errCode={formState.errors.date}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                }}>
                <Text style={styles.optionLabels}>Time TBD</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <Switch
                    value={formState.inputValues.timeTbd}
                    onValueChange={value => onChange('timeTbd', value, true)}
                  />
                </View>
              </View>
              {!formState.inputValues.timeTbd ? (
                <View
                  style={{
                    flexDirection: 'row'
                  }}>
                  <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={styles.formLabels}>Start Time</Text>
                    <View style={{ right: '40%'}}>
                      <RNDateTimePicker
                        mode={'time'}
                        display={'default'}
                        onChange={(event, date) => {
                          setStartTime(date);
                          onChange('startTime', moment(date, 'hh:mm A').format('HH:mm'), true);
                        }}
                        value={startTime || new Date()}
                      />
                    </View>
                  </View>
                  <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <Text style={styles.formLabels}>End Time</Text>
                    <View style={{ right: '45%' }}>
                      <RNDateTimePicker
                        mode={'time'}
                        display={'default'}
                        onChange={(event, date) => {
                          setEndTime(date);
                          onChange('endTime', moment(date, 'hh:mm A').format('HH:mm'), true);
                        }}
                        value={endTime || new Date()}
                      />
                    </View>
                  </View>
                </View>
              ) : null}
              {!formState.inputValidities.startTime ?
                <View style={{marginBottom: 30, marginTop: 10}}>
                  <ErrorMessage isValid={formState.inputValidities.startTime} errCode={formState.errors.startTime} />
                  <ErrorMessage isValid={formState.inputValidities.endTime} errCode={formState.errors.endTime} />
                </View>
                :
                null
              }
              <Text style={styles.formLabels}>Location</Text>
              <TouchableOpacity
                onPress={onSelectLocation}
                style={{ marginBottom: formState.inputValidities.locationId ? 10 : 0}}>
                <View style={[styles.dateContainer, {backgroundColor: theme.inputBg}]}>
                  <Text
                    style={[
                      styles.date,
                      {
                        color: !formState.inputValidities.locationId ? 'red' : 
                          (locationValue === 'Choose Location' ? '#C0C0CA' : theme.inputText),
                        shadowOpacity: 0,
                        fontSize: 16,
                      },
                    ]}>
                    {locationValue}
                  </Text>
                  <View style={styles.iconContainer}>
                    <Icon
                      color={!formState.inputValidities.locationId ? 'red' : '#A8A4B8'}
                      name="location-outline"
                      size={20}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {!formState.inputValidities.locationId ?
                <View style={{marginBottom: 30}}>
                  <ErrorMessage isValid={formState.inputValidities.locationId} errCode={formState.errors.locationId} />
                </View>
                :
                null
              }
              <UiInput
                id="locationDetails"
                initialValue={formState.inputValues.locationDetails}
                isValid={formState.inputValidities.locationDetails}
                placeholder="Location Details (Ex: Field #11)"
                multiline={true}
                onInputChange={onChange}
                bg={theme.inputBg}
                color={theme.inputText}
                placeholderClr={theme.inputPlaceholder}
                cursor={theme.cursor}
              />
              <Text style={styles.formLabels}>Team</Text>
              <UiDropdown
                options={teams}
                multiselect={false}
                group={true}
                initialValue={initTeam.length !== 0 ? initTeam : null}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
                onSelect={onSelectHandler}
                isValid={formState.inputValidities.teamId}
                errCode={formState.errors.teamId}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                  marginTop: 20,
                }}>
                <Text style={styles.optionLabels}>Notify Team(s)</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <Switch
                    value={formState.inputValues.notifyTeam}
                    onValueChange={value => onChange('notifyTeam', value, true)}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                }}>
                <Text style={styles.optionLabels}>Arrive Early</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <Switch
                    value={formState.inputValues.arriveEarly}
                    onValueChange={value =>
                      onChange('arriveEarly', value, true)
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                }}>
                <Text style={styles.optionLabels}>Cancelled</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <Switch
                    value={formState.inputValues.status === 'approved' ? false : true}
                    onValueChange={value =>
                      onChange('status', value ? 'cancelled' : 'approved' , true)
                    }
                  />
                </View>
              </View>
              {type === 'Game' ? (
                <View style={{ marginTop: 20 }}>
                  <UiInput
                    id="opponent"
                    placeholder={'Opponent'}
                    bg={theme.inputBg}
                    color={theme.inputText}
                    placeholderClr={theme.inputPlaceholder}
                    onInputChange={onChange}
                  />
                </View>
              ) : null}
              {type === 'Game' || type === 'Practice' ?
                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                  <Text style={styles.formLabels}>Jersey</Text>
                  <View style={{alignItems: 'flex-end', width: '85%'}}>
                    <UiToggle
                      labelLeft={'Home'}
                      labelRight={'Away'}
                      value={formState.inputValues.jersey.charAt(0).toUpperCase() + formState.inputValues.jersey.slice(1)}
                      onInputChange={(aValue) => onChange('jersey', aValue.toLowerCase(), true)}
                    />
                  </View>
                </View>
                :
                null
              }
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                }}>
                <Text style={styles.optionLabels}>Repeat</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <Switch
                    value={doesRepeat}
                    onValueChange={value =>
                      setDoesRepeat(value)
                    }
                  />
                </View>
              </View>
              {doesRepeat ?
                <View>
                  <UiDropdown
                    options={REPEATS}
                    multiselect={true}
                    placeholder="Choose Interval"
                    size="large"
                    isValid={formState.inputValidities.repeats}
                    group={false}
                    onSelect={(value) => console.log("Joell value", value)}
                  />
                  <Text style={styles.formLabels}>Repeat End Date</Text>
                  <View style={styles.marginTop}>
                    <UiDatePicker
                      id="repeatEndDate"
                      placeholder={
                        repeatEndDate
                          ? moment(repeatEndDate).format(
                              'dddd, D MMM YYYY',
                            )
                          : 'Tap to Select'
                      }
                      onChange={(id, date) => setRepeatEndDate(date)}
                      height={300}
                    />
                  </View>
                </View>
                :
                null
              }
              <View style={[{ flexDirection: 'column', marginTop: 20 }]}>
                <Text style={styles.formLabels}>Extra Notes</Text>
                <UiInput
                  id="notes"
                  initialValue={formState.inputValues.notes}
                  isValid={formState.inputValidities.notes}
                  errCode={formState.errors.description}
                  placeholder="Notes (Ex: Make sure to study playbook)"
                  multiline={true}
                  onInputChange={onChange}
                  bg={theme.inputBg}
                  color={theme.inputText}
                  placeholderClr={theme.inputPlaceholder}
                  cursor={theme.cursor}
                />
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
            label={event ? "Save" : "Create"}
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={() => createEventHandler()}
          />
        </View>
      </View>
      <EventLocation
        showLocation={location}
        closeLocation={() => setLocation(false)}
        onSelect={onReturnLocation}
      />
      </KeyboardAvoidingView>
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
    backgroundColor: '#F2F2F2',
  },
  modalContentContainer: {
    width: '100%',
    height: '93%',
    backgroundColor: 'white',
  },
  modalHeader: {
    padding: 30,
    marginTop: 20,
    borderBottomColor: '#414141',
    borderBottomWidth: 1,
    borderStyle: 'solid',
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
    fontSize: 20,
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
    right: 30,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    minHeight: 58,
    borderRadius: 8,
    backgroundColor: '#EAEAEA',
  },
  date: {
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 10,
    paddingTop: 20,
  },
  marginTop: {
    marginTop: 5,
    marginBottom: 15
  }
});

export default CreateEvent;
