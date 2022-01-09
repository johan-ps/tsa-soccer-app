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
import { UiButton, UiDropdown, UiToggle, UiInput, UiSwitch } from '../_components';
import EventLocation from './EventLocation';
import * as eventActions from '../../store/actions/EventActions';
import * as teamActions from '../../store/actions/TeamActions';
import * as loaderActions from '../../store/actions/LoaderActions'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import ErrorMessage from '../UiComponents/ErrorMessage';
import TeamSelect from './TeamSelect';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    type: '',
    date: null,
    timeTbd: false,
    startTime: null,
    endTime: null,
    locationId: null,
    locationDetails: '',
    authorId: null,
    notes: '',
    status: 'approved',
    notifyTeam: true,
    opponent: '',
    jersey: 'home',
    arriveEarly: false,
    teamId: null, 
    doesRepeat: false,
    interval: 'weekly',
    weeklyOccurence: [],
    repeatEndDate: null
  },
  inputValidities: {
    type: true,
    date: true,
    timeTbd: true,
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
    doesRepeat: true,
    interval: true,
    weeklyOccurence: true,
    repeatEndDate: true
  },
  errors: {
    type: null,
    date: null,
    timeTbd: null,
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
    doesRepeat: null,
    interval: null,
    weeklyOccurence: null,
    repeatEndDate: null
  },
  formIsValid: true,
};

const getFormData = (isEdit, data) => {
  if (isEdit) {
    return {
      inputValues: {
        type: data.type || '',
        date: data.date ? moment(data.date).add(1, 'day') : null,
        timeTbd: data.timeTbd ? true : false,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        locationId: data.locationId || null,
        locationDetails: data.locationDetails || '',
        authorId: data.authorId || null,
        notes: data.notes || '',
        status: data.status || 'approved',
        notifyTeam: data.notifyTeam ? true : false,
        opponent: data.opponent || '',
        jersey: data.jersey || 'home',
        arriveEarly: data.arriveEarly ? true : false,
        teamId: data.teamId || null, 
        doesRepeat: data.doesRepeat || false,
        interval: data.interval || 'weekly',
        weeklyOccurence: data.weeklyOccurence || [],
        repeatEndDate: data.repeatEndDate || null
      },
      inputValidities: {
        type: true,
        date: true,
        timeTbd: true,
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
        doesRepeat: true,
        interval: true,
        weeklyOccurence: true,
        repeatEndDate: true
      },
      errors: {
        type: null,
        date: null,
        timeTbd: null,
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
        doesRepeat: null,
        interval: null,
        weeklyOccurence: null,
        repeatEndDate: null
      },
      formIsValid: true,
    };
  } else {
    return formInit;
  }
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
  const { route } = props;
  const { type, event, reloadEvent } = route.params;
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const userId = userData && userData.id;
  const unformattedTeams = useSelector(state => state.teams);
  const teams = unformattedTeams && formatTeams(unformattedTeams);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, getFormData(event ? true : false, event));
  const [initTeam, setInitTeam] = useState([]);

  useFocusEffect(() => {
    dispatch(updateVisibility(false));
  });

  useEffect(() => {
    onChange('authorId', userId);
    setStartTime(new Date());
    onChange('startTime', moment(new Date(), 'hh:mm A').format('HH:mm'));
    setEndTime(new Date(moment().add(2, 'hours')));
    onChange('endTime', moment().add(2, 'hours').format('HH:mm'));
    if(event != null){
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
      onChange('type', 'Game');
    } else if (type === 'Practice') {
      onChange('type', 'Practice');
    }
  }, []);

  const onChange = useCallback(
    (inputId, inputValue) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: true,
        input: inputId,
      });
    },
    [dispatchFormState],
  );

  const [location, setLocation] = useState(false);
  const [locationValue, setLocationValue] = useState('Choose Location');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(null);
  const [repeatDays, setRepeatDays] = useState([]);
  const [showRepeatDate, setShowRepeatDate] = useState(false);

  const onSelectLocation = () => {
    setLocation(true);
  };

  const onReturnLocation = location => {
    setLocationValue(location.name);
    onChange('locationId', location.id);
  };

  const createEventHandler = async () => {
    if(event){
      updateEventHandler();
    }else{
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
    }
  };

  const updateEventHandler = async () => {
    dispatch(loaderActions.updateLoader(true));
      try{
        let data = {...formState.inputValues};
        if (event) {
          data.id = event.id;
        }
        console.log("Joel teamId", data.teamId);
        await dispatch(
          eventActions.updateEvent({
            ...data,
            date: data.date ? moment(data.date).format('YYYY-MM-DD') : null,
            teamId: Number.isInteger(data.teamId) ? data.teamId : null
          }),
        );
        props.navigation.goBack();
        dispatchFormState({ type: 'reset' });
        reloadEvent();
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
  }

  const onSelectHandler = useCallback(inputValue => {
    if (inputValue) {
      onChange('teamId', inputValue);
    }
  }, []);

  const onSelectRepeatHandler = useCallback(inputValue => {
    if (inputValue) {
      console.log(inputValue);
    }
  }, []);


  const labelFont = {
    fontFamily: theme.fontRegular,
    color: theme.secondaryText,
  };

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
                  { color: theme.primaryText, fontFamily: theme.fontBold },
                ]}>
                {event ? 'Edit' : 'Create a'}{type === 'Other' && !event ? `n ${type}` : ` ${type}`} Event
              </Text>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={styles.iconContainer}>
                <Icon name="close-outline" color={theme.primaryText} size={36} />
              </TouchableOpacity>
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
                    initialValue={formState.inputValues.type}
                    isValid={formState.inputValidities.type}
                    onInputChange={onChange}
                    errCode={formState.errors.type}
                  />
                </View>
              ) : null}
              <Text style={[styles.formLabels, labelFont]}>Date</Text>
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
                  onChange={(id, date) => onChange(id, date)}
                  height={300}
                  existingDate={formState.inputValues.date ? new Date(moment(formState.inputValues.date)) : null}
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
                <Text style={[styles.optionLabels, labelFont]}>Time TBD</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <UiSwitch
                    value={formState.inputValues.timeTbd}
                    onValueChange={value => onChange('timeTbd', value)}
                    trackColor={{ false: '#767577', true: '#E41B23' }}
                  />
                </View>
              </View>
              {!formState.inputValues.timeTbd ? (
                <View
                  style={{
                    flexDirection: 'row'
                  }}>
                  <View style={{ width: '50%', justifyContent: 'flex-start' }}>
                    <Text style={[styles.formLabels, labelFont]}>Start Time</Text>
                    <View style={{ right: '40%'}}>
                      <RNDateTimePicker
                        mode={'time'}
                        display={'default'}
                        onChange={(event, date) => {
                          setStartTime(date);
                          onChange('startTime', moment(date, 'hh:mm A').format('HH:mm'));
                        }}
                        value={startTime || new Date()}
                        themeVariant="light"
                      />
                    </View>
                  </View>
                  <View style={{ width: '50%', justifyContent: 'flex-end' }}>
                    <Text style={[styles.formLabels, labelFont]}>End Time</Text>
                    <View style={{ right: '45%' }}>
                      <RNDateTimePicker
                        mode={'time'}
                        display={'default'}
                        onChange={(event, date) => {
                          setEndTime(date);
                          onChange('endTime', moment(date, 'hh:mm A').format('HH:mm'));
                        }}
                        value={endTime || new Date()}
                        themeVariant="light"
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
              <Text style={[styles.formLabels, labelFont]}>Location</Text>
              <TouchableOpacity
                onPress={onSelectLocation}
                style={{ marginBottom: formState.inputValidities.locationId ? 10 : 0}}>
                <View style={[styles.dateContainer, {backgroundColor: theme.ddBgClr}]}>
                  <Text
                    style={[
                      styles.date,
                      {
                        color: !formState.inputValidities.locationId ? theme.error : theme.secondaryText,
                        shadowOpacity: 0,
                        fontSize: 16,
                        fontFamily: 'Mark Pro'
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
              <Text style={[styles.formLabels, labelFont]}>Location Details</Text>
              <UiInput
                id="locationDetails"
                initialValue={formState.inputValues.locationDetails}
                isValid={formState.inputValidities.locationDetails}
                errCode={formState.errors.locationDetails}
                placeholder="(Ex: Field #11)"
                multiline={true}
                onInputChange={onChange}
              />
              <Text style={[styles.formLabels, labelFont]}>Team</Text>
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
                <Text style={[styles.optionLabels, labelFont]}>Notify Team(s)</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <UiSwitch
                    value={formState.inputValues.notifyTeam}
                    onValueChange={value => onChange('notifyTeam', value)}
                    trackColor={{ false: '#767577', true: '#E41B23' }}
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
                <Text style={[styles.optionLabels, labelFont]}>Arrive Early</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <UiSwitch
                    value={formState.inputValues.arriveEarly}
                    onValueChange={value =>
                      onChange('arriveEarly', value)
                    }
                    trackColor={{ false: '#767577', true: '#E41B23' }}
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
                <Text style={[styles.optionLabels, labelFont]}>Cancelled</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <UiSwitch
                    value={formState.inputValues.status === 'approved' ? false : true}
                    onValueChange={value =>
                       onChange('status', value ? 'cancelled' : 'approved')
                     }
                    trackColor={{ false: '#767577', true: '#E41B23' }}
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
                    initialValue={formState.inputValues.opponent}
                    isValid={formState.inputValidities.opponent}
                    onInputChange={onChange}
                  />
                </View>
              ) : null}
              {type === 'Game' || type === 'Practice' ?
                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                  <Text style={[styles.formLabels, labelFont]}>Jersey</Text>
                  <View style={{alignItems: 'flex-end', width: '85%'}}>
                    <UiToggle
                      labelLeft={'Home'}
                      labelRight={'Away'}
                      value={formState.inputValues.jersey.charAt(0).toUpperCase() + formState.inputValues.jersey.slice(1)}
                      onInputChange={(aValue) => onChange('jersey', aValue.toLowerCase())}
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
                <Text style={[styles.optionLabels, labelFont]}>Repeat</Text>
                <View
                  style={{
                    alignItems: 'flex-end',
                    width: '100%',
                    position: 'absolute',
                  }}>
                  <UiSwitch
                    value={formState.inputValues.doesRepeat}
                    onValueChange={value =>
                      onChange('doesRepeat', value)
                    }
                    trackColor={{ false: '#767577', true: '#E41B23' }}
                  />
                </View>
              </View>
              {formState.inputValues.doesRepeat ?
                <View>
                  <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 10 }}>
                    <Text style={[styles.formLabels, labelFont]}>Interval</Text>
                    <View style={{alignItems: 'flex-end', width: '83%'}}>
                      <UiToggle
                        labelLeft={'Weekly'}
                        labelRight={'Monthly'}
                        value={formState.inputValues.interval.charAt(0).toUpperCase() + formState.inputValues.interval.slice(1)}
                        onInputChange={(aValue) => onChange('interval', aValue.toLowerCase())}
                      />
                    </View>
                  </View>
                  {/* <TeamSelect currentTeam={currentTeam} onSelect={() => null)} title="Select Teams"/> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      height: 50,
                    }}>
                    <Text style={[styles.optionLabels, labelFont]}>Repeat End Date</Text>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        width: '100%',
                        position: 'absolute',
                      }}>
                      <UiSwitch
                        value={showRepeatDate}
                        onValueChange={value =>
                          setShowRepeatDate(value)
                        }
                        trackColor={{ false: '#767577', true: '#E41B23' }}
                      />
                    </View>
                  </View>
                  {showRepeatDate ?
                    <View style={styles.marginTop}>
                      <UiDatePicker
                        id="repeatEndDate"
                        placeholder={
                          formState.inputValues.repeatEndDate
                            ? moment(formState.inputValues.repeatEndDate).format(
                                'dddd, D MMM YYYY',
                              )
                            : 'Tap to Select'
                        }
                        onChange={(id, date) => onChange(id, date)}
                        height={300}
                        existingDate={formState.inputValues.repeatEndDate ? new Date(moment(formState.inputValues.repeatEndDate)) : null}
                        isValid={formState.inputValidities.repeatEndDate}
                        errCode={formState.errors.repeatEndDate}
                      />
                    </View>
                    :
                    null
                  }
                </View>
                :
                null
              }
              <View style={[{ flexDirection: 'column', marginTop: 20 }]}>
                <Text style={[styles.formLabels, labelFont]}>Extra Notes</Text>
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
            onPress={() => createEventHandler()}
            label={event ? "Update" : "Create"}
            width="100%"
            height={62}
            borderRadius={16}
            primaryClr={theme.buttonPrimaryBg}
            secondaryClr={theme.buttonPrimaryText}
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
  modalFooter: {
    padding: 15,
    bottom: 5,
    backgroundColor: '#00000000',
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
    padding: 20,
  },
  modalBody: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 56,
  },
  formHeading: {
    fontSize: 24,
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
    top: 15
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
