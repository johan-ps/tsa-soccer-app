import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  UiInput,
  ScreenBoilerplate,
  UiModal,
  UiIcon,
  UiImage,
} from '../components/_components';
import * as Progress from 'react-native-progress';
import ImagePicker from 'react-native-image-crop-picker';
import * as userActions from '../store/actions/UserActions';
import * as loaderActions from '../store/actions/LoaderActions';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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
    return state;
  }
};

const EditProfileScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [border, setBorder] = useState(0);
  const [imgPickerModalVisible, setImgPickerModalVisible] = useState(false);

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(false));
  });

  const formInit = {
    inputValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNum: userData.phoneNum,
      profileImg: userData.profileImg,
    },
    inputValidities: {
      firstName: true,
      lastName: true,
      email: true,
      phoneNum: true,
      profileImg: true,
    },
    formIsValid: true,
  };

  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

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

  useEffect(() => {
    setTimeout(() => setBorder(0.8), 400);
  }, []);

  const imagePickerHandler = () => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true,
          includeExif: true,
        })
          .then(img => {
            console.log('received base64 img');
            dispatchFormState({
              type: FORM_INPUT_UPDATE,
              value: {
                uri: `data:${img.mime};base64,` + img.data,
                width: img.width,
                height: img.height,
                type: img.mime,
                name: img.filename,
              },
              isValid: true,
              input: 'profileImg',
            });
          })
          .catch(e => {
            console.log(e);
          });
      }, 400);
    } else {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: true,
        includeExif: true,
      })
        .then(img => {
          console.log('received base64 img');
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: {
              uri: img.path,
              width: img.width,
              height: img.height,
              type: img.mime,
              name: `profileImg.${img.mime.split('/')[1]}`,
            },
            isValid: true,
            input: 'profileImg',
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const cameraHandler = () => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        ImagePicker.openCamera({
          cropping: true,
          width: 500,
          height: 500,
          includeExif: true,
          mediaType: 'photo',
        })
          .then(img => {
            console.log('received image', img);
            dispatchFormState({
              type: FORM_INPUT_UPDATE,
              value: {
                uri: img.path,
                width: img.width,
                height: img.height,
                type: img.mime,
                name: img.filename,
              },
              isValid: true,
              input: 'profileImg',
            });
          })
          .catch(e => {
            console.log(e);
          });
      }, 400);
    } else {
      ImagePicker.openCamera({
        cropping: true,
        width: 500,
        height: 500,
        includeExif: true,
        mediaType: 'photo',
      })
        .then(img => {
          console.log('received image', img);
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: {
              uri: img.path,
              width: img.width,
              height: img.height,
              type: img.mime,
              name: `profileImg.${img.mime.split('/')[1]}`,
            },
            isValid: true,
            input: 'profileImg',
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const onUpdateUserHandler = async () => {
    dispatch(loaderActions.updateLoader(true));
    await dispatch(
      userActions.updateUser({
        firstName: formState.inputValues.firstName,
        lastName: formState.inputValues.lastName,
        email: formState.inputValues.email,
        phoneNum: formState.inputValues.phoneNum,
        profileImg: formState.inputValues.profileImg,
        id: userData.id,
      }),
    );
    dispatch(loaderActions.updateLoader(false));
    navigation.goBack();
  };

  return (
    <ScreenBoilerplate
      headingClr={theme.primaryText}
      navLeft
      navRight="checkmark"
      navRightBg={theme.actionBtnBg}
      navRightText={theme.actionBtnText}
      style={{ backgroundColor: theme.secondaryBg }}
      tabBarVisible={false}
      navActionRight={onUpdateUserHandler}
      navActionLeft={() => {
        navigation.goBack();
      }}>
      <View style={styles.container}>
        <View style={styles.fieldContainer}>
          <View style={styles.profilePictureContainer}>
            <Progress.Circle
              size={120}
              progress={border}
              borderWidth={0}
              animated={true}
              thickness={3}
              color={theme.accent}
              style={styles.positionAbs}
            />
            <UiImage
              style={styles.profilePicture}
              source={formState.inputValues.profileImg}
              cond={
                formState.inputValues.profileImg &&
                formState.inputValues.profileImg !== 'null'
              }
              alt={
                <UiIcon
                  icon="person"
                  color={theme.actionBtnText}
                  backgroundColor={theme.actionBtnBg}
                  size={40}
                  type="round"
                  darkBg={theme.name === 'dark'}
                />
              }
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => {
                setImgPickerModalVisible(true);
              }}
              activeOpacity={1}
              style={styles.editIconOverlay}>
              <Icon color="white" size={16} name="pencil" />
              <Text
                style={[
                  styles.editIconText,
                  { fontFamily: theme.fontRegular },
                ]}>
                Edit Image
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.playerNameContainer}>
            <Text
              style={[
                styles.playerFirstName,
                { color: theme.primaryText, fontFamily: theme.fontRegular },
              ]}
              numberOfLines={1}>
              {userData.firstName}
            </Text>
            <Text
              style={[
                styles.playerLastName,
                { color: theme.secondaryText, fontFamily: theme.fontRegular },
              ]}
              numberOfLines={1}>
              {userData.lastName}
            </Text>
          </View>
          <View style={styles.field}>
            <UiInput
              id="firstName"
              initialValue={formState.inputValues.firstName}
              inputValidities={formState.inputValidities.firstName}
              placeholder="First Name"
              style={styles.marginBottom}
              onInputChange={onChangeText}
              bg={theme.inputBg}
              color={theme.inputText}
              placeholderClr={theme.inputPlaceholder}
              cursor={theme.cursor}
            />
            <UiInput
              id="lastName"
              initialValue={formState.inputValues.lastName}
              inputValidities={formState.inputValidities.lastName}
              placeholder="Last Name"
              style={styles.marginBottom}
              onInputChange={onChangeText}
              bg={theme.inputBg}
              color={theme.inputText}
              placeholderClr={theme.inputPlaceholder}
              cursor={theme.cursor}
            />
            <UiInput
              id="phoneNum"
              initialValue={formState.inputValues.phoneNum}
              inputValidities={formState.inputValidities.phoneNum}
              placeholder="Phone Number"
              style={styles.marginBottom}
              onInputChange={onChangeText}
              bg={theme.inputBg}
              color={theme.inputText}
              placeholderClr={theme.inputPlaceholder}
              cursor={theme.cursor}
            />
            <UiInput
              id="email"
              initialValue={formState.inputValues.email}
              inputValidities={formState.inputValidities.email}
              placeholder="Email"
              style={styles.marginBottom}
              onInputChange={onChangeText}
              bg={theme.inputBg}
              color={theme.inputText}
              placeholderClr={theme.inputPlaceholder}
              cursor={theme.cursor}
            />
          </View>
        </View>
      </View>
      <UiModal
        primaryLabel="Camera"
        secondaryLabel="Library"
        visible={imgPickerModalVisible}
        title="Upload Image"
        content={'How would you like to upload your image?'}
        primaryBtnHandler={cameraHandler}
        secondaryBtnHandler={imagePickerHandler}
        closeable={true}
        onClose={() => {
          setImgPickerModalVisible(false);
        }}
        icon="aperture-outline"
        onCloseHandler={() => {
          setImgPickerModalVisible(false);
        }}
      />
    </ScreenBoilerplate>
  );
};

const styles = StyleSheet.create({
  positionAbs: {
    position: 'absolute',
  },
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  editIconOverlay: {
    position: 'absolute',
    width: 90,
    height: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    opacity: 0,
  },
  editIconText: {
    fontSize: 10,
    color: 'white',
    marginTop: 10,
  },
  fieldContainer: {},
  field: {},
  marginBottom: {
    marginBottom: 10,
  },
  profilePicture: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
  profilePictureContainer: {
    borderRadius: 60,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  playerNameContainer: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
  },
  playerFirstName: {
    fontSize: 40,
    marginBottom: -15,
  },
  playerLastName: {
    fontSize: 40,
  },
  playerInfo: {
    fontSize: 20,
    color: 'black',
  },
  playerNumber: {
    fontSize: 30,
    color: '#A9A9A9',
  },
});

export default EditProfileScreen;
