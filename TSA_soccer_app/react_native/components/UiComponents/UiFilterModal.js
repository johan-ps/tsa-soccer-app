import React, {
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatTeams } from '../../Util/utilities';
import { UiButton, UiDropdown } from '../_components';
import * as teamActions from '../../store/actions/TeamActions';
import UiDatePicker from './UiDatePicker';
import moment from 'moment';
import * as loaderActions from '../../store/actions/LoaderActions';
import * as announcementActions from '../../store/actions/AnnouncementActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import UiBottomSheet from './UiBottomSheet';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_INPUT_APPLY = 'FORM_INPUT_APPLY';
const FORM_INPUT_RESET = 'FORM_INPUT_RESET';

const formInit = {
  inputValues: {
    teams: [],
    startDate: null,
    endDate: null,
  },
  prevState: {
    teams: [],
    startDate: null,
    endDate: null,
  },
  inputValidities: {
    teams: true,
    startDate: true,
    endDate: true,
  },
  errors: {
    teams: null,
    startDate: null,
    endDate: null,
  },
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

    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      errors: updatedErrors,
      prevState: { ...state.prevState },
    };
  } else if (action.type === FORM_INPUT_APPLY) {
    return {
      ...state,
      inputValues: { ...state.inputValues },
      prevState: { ...state.inputValues },
    };
  } else if (action.type === FORM_INPUT_RESET) {
    return {
      ...state,
      inputValues: { ...state.prevState },
      prevState: { ...state.prevState },
    };
  } else {
    return {
      ...formInit,
      prevState: { ...state.prevState },
    };
  }
};

const UiFilterModal = forwardRef((props, ref) => {
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);
  const bottomSheetRef = useRef();
  const ddRef = useRef();

  useImperativeHandle(ref, () => ({
    snapToIndex,
    reset: secondaryBtnHandler,
  }));

  const loadFilteredAnnouncements = useCallback(
    async filters => {
      try {
        dispatch(loaderActions.updateLoader(true));
        await dispatch(announcementActions.getFilteredAnnouncements(filters));
        props.onCloseHandler(false);
      } catch (error) {
        if (error && error.length > 0) {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  const snapToIndex = index => {
    bottomSheetRef.current.snapToIndex(index);
  };

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

  const primaryBtnHandler = useCallback(() => {
    dispatchFormState({ type: FORM_INPUT_APPLY });
    props.onUpdateFilter(formState.inputValues);
    loadFilteredAnnouncements(formState.inputValues);
    bottomSheetRef.current.close();
  }, [formState.inputValues, loadFilteredAnnouncements, props]);

  const secondaryBtnHandler = () => {
    ddRef.current.reset();
    dispatchFormState({ type: 'reset' });
  };

  const teams = useSelector(state => formatTeams(state.teams));

  const onSelectHandler = useCallback(inputValue => {
    if (inputValue) {
      let selectedTeams = [];

      for (let group in inputValue) {
        for (let teamId in inputValue[group].children) {
          if (inputValue[group].children[teamId]) {
            selectedTeams.push(teamId);
          }
        }
      }

      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: selectedTeams,
        isValid: true,
        input: 'teams',
      });
    }
  }, []);

  const onDateChange = (inputId, value) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value,
      isValid: true,
      input: inputId,
    });
  };

  const onCloseHandler = useCallback(() => {
    dispatchFormState({ type: FORM_INPUT_RESET });
    props.onCloseHandler();
  }, [props]);

  return (
    <UiBottomSheet
      bottomInset={Platform.OS === 'ios' ? 250 : 170}
      title="Filter"
      ref={bottomSheetRef}
      onCloseHandler={onCloseHandler}
      primaryBtnHandler={primaryBtnHandler}
      secondaryBtnHandler={secondaryBtnHandler}
      footerLabel="Apply Filter"
      secondaryLabel="Reset">
      <View style={styles.bottomSheetContent}>
        <UiDropdown
          ref={ddRef}
          options={teams}
          multiselect={true}
          group={true}
          placeholder="Choose teams"
          size="large"
          optionSize="large"
          onSelect={onSelectHandler}
          existingValues={formState.inputValues.teams}
          isValid={formState.inputValidities.teams}
          errCode={formState.errors.teams}
        />
        <View style={styles.marginTop}>
          <UiDatePicker
            id="startDate"
            placeholder={
              formState.inputValues.startDate
                ? moment(formState.inputValues.startDate).format(
                    'dddd, D MMM YYYY',
                  )
                : 'Select start date'
            }
            existingDate={formState.inputValues.startDate}
            onChange={onDateChange}
            height={280}
            isValid={formState.inputValidities.startDate}
            errCode={formState.errors.startDate}
          />
        </View>
        <View style={styles.marginTop}>
          <UiDatePicker
            id="endDate"
            placeholder={
              formState.inputValues.endDate
                ? moment(formState.inputValues.endDate).format(
                    'dddd, D MMM YYYY',
                  )
                : 'Select end date'
            }
            existingDate={formState.inputValues.endDate}
            onChange={onDateChange}
            height={280}
            isValid={formState.inputValidities.endDate}
            errCode={formState.errors.endDate}
          />
        </View>
      </View>
    </UiBottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContent: {
    marginTop: 10,
  },
  bottomSheetFooter: {
    paddingHorizontal: 15,
  },
  closeBtn: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  marginTop: {
    marginTop: 40,
  },
  modalContainer: {
    paddingHorizontal: 15,
  },
  textContainer: {
    padding: 5,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    padding: 5,
  },
  contentWrapper: {
    justifyContent: 'space-between',
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
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    elevation: 24,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    shadowColor: '#000000',
    zIndex: 200,
  },
});

export default memo(UiFilterModal);
