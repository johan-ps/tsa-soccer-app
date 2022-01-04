import React, {
  useState,
  useCallback,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SettingsActionBtn,
  ScreenBoilerplate,
} from '../components/_components';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';
import { UiIconButton } from '../components/_components';
import { formatTeams } from '../Util/utilities';
import * as teamActions from '../store/actions/TeamActions';
import TeamCard from '../components/Profile/TeamCard';
import { UiButton } from '../components/_components';
import {
  updateNotificationPreferences,
  loadNotificationPreferences,
} from '../api/notifications';
import * as loaderActions from '../store/actions/LoaderActions';
import messaging from '@react-native-firebase/messaging';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_INPUT_INIT = 'FORM_INPUT_INIT';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };

    const newState = {
      inputValues: updatedValues,
      initValues: { ...state.initValues },
      dirty: false,
    };

    for (const key in updatedValues) {
      if (newState.inputValues[key] !== newState.initValues[key]) {
        newState.dirty = true;
        break;
      }
    }

    return newState;
  } else if (action.type === FORM_INPUT_INIT) {
    return action.data;
  } else {
    return state;
  }
};

const NotificationScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const teams = useSelector(state => state.teams);
  const userData = useSelector(state => state.userData);
  const [initData, setInitData] = useState({});

  const formInit = useMemo(() => {
    const init = {
      inputValues: {},
      initValues: {},
      dirty: false,
    };

    teams.forEach(({ id }) => {
      init.inputValues[id] = initData[id] ? true : false;
      init.initValues[id] = initData[id] ? true : false;
    });

    return init;
  }, [teams, initData]);

  useEffect(() => {
    dispatchFormState({
      type: FORM_INPUT_INIT,
      data: formInit,
    });
  }, [formInit]);

  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

  const loadNotificationData = useCallback(async () => {
    const prefs = await loadNotificationPreferences(
      userData.authenticated ? userData.id : null,
    );
    return prefs;
  }, [userData.authenticated, userData.id]);

  useEffect(() => {
    dispatch(loaderActions.updateLoader(true));
    loadNotificationData().then(prefs => {
      const prefObj = {};
      prefs.forEach(pref => {
        prefObj[pref] = true;
      });
      setInitData(prefObj);
      dispatch(loaderActions.updateLoader(false));
    });
  }, [dispatch, loadNotificationData]);

  const onToggleHandler = useCallback(
    id => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: !formState.inputValues[id],
        input: id,
      });
    },
    [formState.inputValues],
  );

  const onUpdateHandler = async () => {
    const removeIds = [];
    const addIds = [];
    const newPref = [];

    for (const key in formState.inputValues) {
      if (formState.inputValues[key] !== formState.initValues[key]) {
        if (formState.inputValues[key]) {
          addIds.push(key);
        } else {
          removeIds.push(key);
        }
      }

      if (formState.inputValues[key]) {
        newPref.push(key);
      }
    }

    try {
      dispatch(loaderActions.updateLoader(true));
      await updateNotificationPreferences(
        { removeIds, addIds, newPref },
        userData && userData.authenticated,
        userData && userData.id,
      );
      removeIds.forEach(id => {
        messaging()
          .unsubscribeFromTopic(`Team${id}`)
          .then(() => {
            console.log(`Unsubscribed to topic: Team${id}`);
          });
      });
      addIds.forEach(id => {
        messaging()
          .subscribeToTopic(`Team${id}`)
          .then(() => {
            console.log(`Subscribed to topic: Team${id}`);
          });
      });
      navigation.goBack();
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(loaderActions.updateLoader(false));
    }
  };

  const renderTeamCards = useMemo(() => {
    const cards = teams.map(team => {
      return (
        <TeamCard
          key={team.id}
          value={formState.inputValues[team.id]}
          onToggle={() => {
            onToggleHandler(team.id);
          }}
          teamName={team.name}
        />
      );
    });
    return <ScrollView>{cards}</ScrollView>;
  }, [formState.inputValues, onToggleHandler, teams]);

  return (
    <View style={[styles.pageContainer, { backgroundColor: theme.primaryBg }]}>
      <View style={styles.headingContainer}>
        <Text
          style={[
            styles.heading,
            { fontFamily: theme.fontBold, color: theme.primaryText },
          ]}>
          Team Notifications
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.iconContainer}>
          <Icon name="close-outline" color={theme.primaryText} size={36} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        {renderTeamCards}
        {formState.dirty && (
          <UiButton
            onPress={onUpdateHandler}
            label="Update"
            width="100%"
            height={62}
            borderRadius={16}
            style={styles.button}
            primaryClr={theme.buttonPrimaryBg}
            secondaryClr={theme.buttonPrimaryText}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    // paddingHorizontal: 15,
    paddingTop: 15,
  },
  heading: {
    fontSize: 24,
  },
  headingContainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 70,
  },
  // container: {
  //   width: '100%',
  //   height: '100%',
  //   flexDirection: 'column',
  //   backgroundColor: '#2f2c55',
  //   padding: 40,
  //   paddingTop: 50,
  // },
  // heading: {},
  // nav: {},
  // headingText: {
  //   color: 'white',
  //   fontFamily: 'Roboto-Medium',
  //   fontSize: 40,
  //   marginTop: 50,
  //   lineHeight: 40,
  // },
  // options: {
  //   marginTop: 40,
  // },
});

export default NotificationScreen;
