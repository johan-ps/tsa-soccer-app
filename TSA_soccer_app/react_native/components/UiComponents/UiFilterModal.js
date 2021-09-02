import React, { useEffect, useState, useCallback, useReducer } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { formatTeams } from '../../Util/utilities';
import { UiButton, UiDropdown } from '../_components';
import * as teamActions from '../../store/actions/TeamActions';
import UiDatePicker from './UiDatePicker';
import moment from 'moment';

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
};

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = { ...state.inputValues };
    if (action.value !== undefined) {
      updatedValues[action.input] = action.value;
    }
    return { inputValues: updatedValues, prevState: { ...state.prevState } };
  } else if (action.type === FORM_INPUT_APPLY) {
    return {
      inputValues: { ...state.inputValues },
      prevState: { ...state.inputValues },
    };
  } else if (action.type === FORM_INPUT_RESET) {
    return {
      inputValues: { ...state.prevState },
      prevState: { ...state.prevState },
    };
  } else {
    return formInit;
  }
};

const UiFilterModal = props => {
  let { visible } = props;
  const [showModal, setShowModal] = useState(visible);
  const theme = useSelector(state => state.theme.colors);
  const modalAnimation = useSharedValue(0);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      modalAnimation.value = withSpring(1, {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: true,
      });
    } else {
      modalAnimation.value = withTiming(0, {}, () => {
        runOnJS(setShowModal)(false);
      });
    }
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

  useEffect(() => {
    toggleModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(modalAnimation.value, [0, 1], [0.5, 1]),
        },
      ],
      opacity: modalAnimation.value,
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: modalAnimation.value,
    };
  });

  const primaryBtnHandler = () => {
    dispatchFormState({ type: FORM_INPUT_APPLY });
    if (props.primaryBtnHandler) {
      props.primaryBtnHandler(formState.inputValues);
    }
    if (props.onCloseHandler) {
      props.onCloseHandler();
    }
  };

  const secondaryBtnHandler = () => {
    dispatchFormState({ type: FORM_INPUT_RESET });
    if (props.secondaryBtnHandler) {
      props.secondaryBtnHandler();
    }
    if (props.onCloseHandler) {
      props.onCloseHandler();
    }
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
        input: 'teams',
      });
    }
  }, []);

  const onDateChange = (inputId, value) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value,
      input: inputId,
    });
  };

  return (
    <Modal transparent={true} visible={showModal}>
      <Animated.View style={[styles.modalViewContainer, opacity]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.cardBg },
            animStyle,
          ]}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                { color: theme.primaryText, fontFamily: theme.fontMedium },
              ]}>
              {props.title}
            </Text>
            <ScrollView style={{ height: '100%' }}>
              <UiDropdown
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
                onSelect={onSelectHandler}
                existingValues={formState.inputValues.teams}
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
                />
              </View>
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
            <UiButton
              primaryClr={theme.button4Txt}
              secondaryClr={theme.button4Bg}
              label={props.secondaryLabel}
              onPress={secondaryBtnHandler}
              type="secondary"
              size="medium"
              borderRadius={10}
              darkBg={true}
              width={130}
              height={50}
            />
            <UiButton
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr={theme.button4Txt}
              label={props.primaryLabel}
              onPress={primaryBtnHandler}
              size="medium"
              borderRadius={10}
              darkBg={true}
              width={130}
              height={50}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  marginTop: {
    marginTop: 20,
  },
  modalViewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 16,
    padding: 26,
    width: '90%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
    zIndex: 20,
    position: 'relative',
  },
  textContainer: {
    padding: 5,
    overflow: 'hidden',
    height: '90%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  content: {
    fontSize: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default UiFilterModal;
