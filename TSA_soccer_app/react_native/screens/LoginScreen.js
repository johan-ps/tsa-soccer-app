import React, { useReducer, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { UiInput, UiButton, UiIconButton } from '../components/_components';
import * as userActions from '../store/actions/UserActions';
import * as loaderActions from '../store/actions/LoaderActions';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';

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
  const theme = useSelector(state => state.theme.colors);

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

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(false));
  });

  const loginHandler = async () => {
    Keyboard.dismiss();
    dispatch(loaderActions.updateLoader(true));
    await dispatch(
      userActions.loginUser({
        username: formState.inputValues.username,
        password: formState.inputValues.password,
      }),
    );
    dispatch(loaderActions.updateLoader(false));
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        behavior="position"
        style={{ backgroundColor: 'white' }}>
        <View style={[styles.container, { backgroundColor: 'white' }]}>
          <View style={styles.contentContainer}>
            <View style={styles.closeButton}>
              <UiIconButton
                icon="close"
                color="#8A8FA9"
                backgroundColor="#F3F4F6"
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
              <Text
                style={[
                  styles.headingTitle,
                  { color: theme.primaryText, fontFamily: 'Mark Pro Medium' },
                ]}>
                Welcome to CTSA!
              </Text>
              <Text
                style={[
                  styles.headingSubtitle,
                  { color: theme.secondaryText, fontFamily: 'Mark Pro' },
                ]}>
                Join our community of over 100 players in the GTA
              </Text>
            </View>
            <View style={styles.body}>
              <UiInput
                id="username"
                iconLeft="mail"
                initialValue={formState.inputValues.username}
                inputValidities={formState.inputValidities.username}
                contentType="username"
                placeholder="Username"
                style={styles.marginBottom}
                onInputChange={onChangeText}
                bg={theme.inputBg}
                color={theme.inputText}
                placeholderClr={theme.inputPlaceholder}
                cursor={theme.cursor}
              />
              <UiInput
                id="password"
                iconLeft="lock"
                initialValue={formState.inputValues.password}
                inputValidities={formState.inputValidities.password}
                contentType="password"
                placeholder="Password"
                icon={{
                  name: 'eye',
                  altName: 'eye-off',
                  size: 26,
                }}
                onInputChange={onChangeText}
                bg={theme.inputBg}
                color={theme.inputText}
                placeholderClr={theme.inputPlaceholder}
                cursor={theme.cursor}
              />
            </View>
          </View>
          <View style={styles.footer}>
            <UiButton
              onPress={loginHandler}
              label="Login"
              width="100%"
              height={62}
              borderRadius={16}
              style={styles.button}
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr="white"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 30,
    top: 40,
  },
  contentContainer: {
    alignItems: 'center',
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
    fontSize: 24,
    marginBottom: 10,
  },
  headingSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    width: '100%',
  },
  footer: {
    padding: 30,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default LoginScreen;
