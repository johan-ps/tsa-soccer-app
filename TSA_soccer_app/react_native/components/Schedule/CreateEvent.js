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
import RNDateTimePicker from '@react-native-community/datetimepicker';

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
    teamId: 5, //TODO: change to null
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
  const { REPEATS } = constants;
  const { visible, route } = props;
  const { type } = route.params;
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const userId = userData && userData.id;
  const unformattedTeams = useSelector(state => state.teams);
  const teams = formatTeams(unformattedTeams);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

  useFocusEffect(() => {
    dispatch(updateVisibility(false));
  });

  useEffect(() => {
    onChange('authorId', userId, true);
    setStartTime(new Date());
    onChange('startTime', moment().format('h:m'), true);
    setEndTime(new Date(moment().add(2, 'hours')));
    onChange('endTime', moment().add(2, 'hours').format('h:m'), true);
    if(type === 'Game'){
      onChange('type', 'Game', true);
    } else if (type === 'Practice') {
      onChange('type', 'Practice', true);
    }
  }, []);

  const onChange = useCallback(
    (inputId, inputValue, inputValidity) => {
      console.log('Joell input:', inputId, inputValue, inputValidity);
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
          date: moment(formState.inputValues.date).format('YYYY-MM-DD'),
        }),
      );
      props.navigation.goBack();
      dispatchFormState({ type: 'reset' });
    }
    catch (error) {
      console.log("Joell error", error);
    } finally {
      dispatch(loaderActions.updateLoader(false));
    }
    
  };

  // TODO: Add full calender view functionality
  // TODO: Add infinite scroll in upcoming ? (FLATLIST VIEW IN REACT NATIVE)
  // TODO: FIX UIDropdown Multiselect to show what you select in the text
  // TODO: Fix UI for availability modal in event screen
  // TODO: Add Scroll in EventScreen where image moves up!
  // TODO: Add edit and delete functionality
  console.log("Joell date", formState.inputValues.date);
  return (
    <SafeAreaView style={{ backgroundColor: theme.secondaryBg }}>
      <View style={[styles.modalContainer, { backgroundColor: theme.secondaryBg }]}>
        <View style={[styles.modalContentContainer, { backgroundColor: theme.secondaryBg }]}>
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.formHeading,
                { color: theme.primaryText, fontFamily: theme.fontRegular },
              ]}>
              Create a{type === 'Other' ? `n ${type}` : ` ${type}`} Event
            </Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              {type === 'Other' ? (
                <UiInput
                  id="title"
                  placeholder="Title"
                  bg={theme.inputBg}
                  style={{marginTop: 20}}
                  color={theme.inputText}
                  placeholderClr={theme.inputPlaceholder}
                  onInputChange={onChange}
                />
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
                      : 'Tap to Select'
                  }
                  onChange={(id, date) => onChange(id, date, true)}
                  height={300}
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ width: '50%', justifyContent: 'center' }}>
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
                  <View style={{ width: '50%', justifyContent: 'center' }}>
                    <Text style={styles.formLabels}>End Time</Text>
                    <RNDateTimePicker
                      mode={'time'}
                      display={'default'}
                      onChange={(event, date) => {
                        setEndTime(date);
                        onChange('endTime', moment(date).format('h:m'), true);
                      }}
                      value={endTime || new Date()}
                    />
                  </View>
                </View>
              ) : null}
              <Text style={styles.formLabels}>Location</Text>
              <TouchableOpacity
                onPress={onSelectLocation}
                style={{ marginBottom: 10 }}>
                <View style={[styles.dateContainer, {backgroundColor: theme.inputBg}]}>
                  <Text
                    style={[
                      styles.date,
                      {
                        color:
                          locationValue === 'Please Select' ? '#C0C0CA' : theme.inputText,
                        shadowOpacity: 0,
                        fontSize: 16,
                      },
                    ]}>
                    {locationValue}
                  </Text>
                  <View style={styles.iconContainer}>
                    <Icon
                      color={'#A8A4B8'}
                      name="location-outline"
                      size={20}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              <UiInput
                id="locationDetails"
                initialValue={formState.inputValues.locationDetails}
                isValid={formState.inputValidities.locationDetails}
                // errCode={formState.errors.description}
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
                placeholder="Choose teams"
                size="large"
                optionSize="large"
                onSelect={values => console.log("values", values)}
                // existingValues={formatTeams(formState.inputValues.teams)}
              />
              {/* <UiDropdown
                modalOffsetY={80}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose Teams"
                size="large"
              /> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  height: 50,
                  marginTop: 10,
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
                    value={formState.inputValues.cancelled}
                    onValueChange={value =>
                      onChange('status', value ? 'approved' : 'cancelled', true)
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
                <View style={{ marginTop: 20, marginBottom: 10 }}>
                  <UiInput
                    id="jersey"
                    placeholder={'Jersey'}
                    bg={theme.inputBg}
                    color={theme.inputText}
                    placeholderClr={theme.inputPlaceholder}
                    onInputChange={onChange}
                  />
                </View>
                :
                null
              }
              <Text style={styles.formLabels}>Repeat</Text>
              <UiDropdown
                options={REPEATS}
                multiselect={true}
                placeholder="Please Select"
                size="large"
              />
              <View style={[{ flexDirection: 'column', marginTop: 20 }]}>
                <Text style={styles.formLabels}>Extra Notes</Text>
                <UiInput
                  id="notes"
                  initialValue={formState.inputValues.notes}
                  isValid={formState.inputValidities.notes}
                  // errCode={formState.errors.description}
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
            label="Create"
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
    right: 12,
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
  }
});

export default CreateEvent;
