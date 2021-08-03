import React, { useReducer, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { UiInput, UiButton, UiIconButton } from '../components/_components';
import * as userActions from '../store/actions/UserActions';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    username: '',
    password: '',
  },
  inputValidities: {
    username: true,
    password: true,
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

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);
  const userData = useSelector(state => state.userData);

  const onChangeText = useCallback(
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

  const loginHandler = async () => {
    Keyboard.dismiss();
    await dispatch(
      userActions.loginUser({
        username: formState.inputValues.username,
        password: formState.inputValues.password,
      }),
    );
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior="position">
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.container}>
        <View style={styles.closeButton}>
          <UiIconButton
            icon="close-outline"
            color="#E41B23"
            backgroundColor="#EAEAEA"
            size={24}
            darkBg={false}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.headerImg}
            source={require('../assets/img/CTSA_Logo.png')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.heading}>
          <Text style={styles.headingTitle}>Welcome to CTSA!</Text>
          <Text style={styles.headingSubtitle}>
            Join our community of over 100 players in the GTA
          </Text>
        </View>
        <View style={styles.body}>
          <UiInput
            id="username"
            initialValue={formState.inputValues.password}
            inputValidities={formState.inputValidities.username}
            contentType="username"
            placeholder="Username"
            style={styles.marginBottom}
            onInputChange={onChangeText}
          />
          <UiInput
            id="password"
            initialValue={formState.inputValues.password}
            inputValidities={formState.inputValidities.password}
            contentType="password"
            placeholder="Password"
            icon={{ name: 'eye-outline', altName: 'eye-off-outline', size: 26 }}
            onInputChange={onChangeText}
          />
          <UiButton
            onPress={loginHandler}
            label="Login"
            width="100%"
            borderRadius={8}
            style={styles.button}
          />
        </View>
        <View style={styles.footer} />
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 30,
    top: 40,
  },
  imgContainer: {
    width: 120,
    height: 120,
    marginTop: 60,
    marginBottom: 20,
  },
  headerImg: {
    width: 120,
    height: 120,
  },
  heading: {
    alignItems: 'center',
    width: '80%',
  },
  headingTitle: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 24,
    marginBottom: 10,
  },
  headingSubtitle: {
    fontFamily: 'Roboto-Regular',
    color: 'rgb(175,176,185)',
    fontSize: 16,
    textAlign: 'center',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    width: '100%',
  },
  footer: {},
  button: {
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 10,
  },
});

export default LoginScreen;
