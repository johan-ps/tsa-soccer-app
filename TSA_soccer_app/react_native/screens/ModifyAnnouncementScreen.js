import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  UiButton,
  UiDropdown,
  UiModal,
  UiInput,
} from '../components/_components';
import ImageUpload from '../components/Announcements/ImageUpload';
import * as announcementActions from '../store/actions/AnnouncementActions';
import * as loaderActions from '../store/actions/LoaderActions';
import * as teamActions from '../store/actions/TeamActions';
import { formatTeams } from '../Util/utilities';
import * as tabbarActions from '../store/actions/TabbarActions';
import Icon from 'react-native-vector-icons/Ionicons';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    title: '',
    imageUrl: null,
    description: '',
    teams: [],
  },
  inputValidities: {
    title: true,
    imageUrl: true,
    description: true,
    teams: true,
  },
  errors: {
    title: null,
    imageUrl: null,
    description: null,
    teams: null,
  },
  formIsValid: true,
};

const getFormData = (isEdit, data) => {
  if (isEdit) {
    return {
      inputValues: {
        title: data.title || '',
        imageUrl: data.image || null,
        description: data.description || '',
        teams: data.teams || [],
      },
      inputValidities: {
        title: true,
        imageUrl: true,
        description: true,
        teams: true,
      },
      errors: {
        title: null,
        imageUrl: null,
        description: null,
        teams: null,
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

const ModifyAnnouncementScreen = props => {
  const { navigation } = props;
  const theme = useSelector(state => state.theme.colors);
  const teams = useSelector(state => formatTeams(state.teams));
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);

  const { isEdit } = props.route.params;
  const { announcementData } = props.route.params;

  const [imgPickerModalVisible, setImgPickerModalVisible] = useState(false);

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    getFormData(isEdit, announcementData),
  );

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
            dispatchFormState({
              type: FORM_INPUT_UPDATE,
              value: {
                uri: `data:${img.mime};base64,` + img.data,
                width: img.width,
                height: img.height,
                type: img.mime,
                name: `profileImg.${img.mime.split('/')[1]}`,
              },
              input: 'imageUrl',
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
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: {
              uri: `${img.path}`,
              width: img.width,
              height: img.height,
              type: img.mime,
              name: `profileImg.${img.mime.split('/')[1]}`,
            },
            input: 'imageUrl',
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
            dispatchFormState({
              type: FORM_INPUT_UPDATE,
              value: {
                uri: img.path,
                width: img.width,
                height: img.height,
                type: img.mime,
                name: `profileImg.${img.mime.split('/')[1]}`,
              },
              input: 'imageUrl',
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
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: {
              uri: `${img.path}`,
              width: img.width,
              height: img.height,
              type: img.mime,
              name: `profileImg.${img.mime.split('/')[1]}`,
            },
            input: 'imageUrl',
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const clearImage = () => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: null,
      input: 'imageUrl',
    });
  };

  const loadTeams = useCallback(async () => {
    try {
      await dispatch(teamActions.getTeams());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(tabbarActions.updateVisibility(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTeams();
    dispatch(tabbarActions.updateVisibility(false));
  }, [dispatch, loadTeams]);

  const modifyAnnouncementScreenHandler = async () => {
    dispatch(loaderActions.updateLoader(true));
    try {
      await dispatch(
        announcementActions.addAnnouncement({
          title: '',
          description: formState.inputValues.description,
          image: formState.inputValues.imageUrl,
          teams: JSON.stringify(formState.inputValues.teams),
          authorId: userData.id,
        }),
      );
      await dispatch(announcementActions.getAnnouncements());
      navigation.goBack();
      dispatchFormState({ type: 'reset' });
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
  };

  const onChangeText = useCallback(
    (inputId, inputValue) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        input: inputId,
        isValid: true,
      });
    },
    [dispatchFormState],
  );

  const onSelectHandler = useCallback(
    inputValue => {
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
          isValid: true,
        });
      }
    },
    [dispatchFormState],
  );

  const onCloseHandler = () => {
    dispatchFormState({ type: 'reset' });
    navigation.goBack();
  };

  const labelFont = {
    fontFamily: theme.fontMedium,
    color: theme.secondaryText,
  };

  return (
    <View>
      <View
        style={[styles.modalContainer, { backgroundColor: theme.primaryBg }]}>
        <View
          style={[
            styles.modalContentContainer,
            { backgroundColor: theme.primaryBg },
          ]}>
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.formHeading,
                { color: theme.primaryText, fontFamily: theme.fontBold },
              ]}>
              New Announcement
            </Text>
            <TouchableOpacity
              onPress={onCloseHandler}
              style={styles.iconContainer}>
              <Icon name="close-outline" color={theme.primaryText} size={36} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              <Text style={[styles.formLabels, labelFont]}>Description</Text>
              <UiInput
                id="description"
                initialValue={formState.inputValues.description}
                isValid={formState.inputValidities.description}
                errCode={formState.errors.description}
                placeholder="Description"
                multiline={true}
                onInputChange={onChangeText}
              />
              <Text style={[styles.formLabels, labelFont]}>Team</Text>
              <UiDropdown
                id="teams"
                onSelect={onSelectHandler}
                modalOffsetY={110}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
                isValid={formState.inputValidities.teams}
                errCode={formState.errors.teams}
              />
              <Text style={[styles.formLabels, labelFont]}>Upload Image</Text>
              <ImageUpload
                imgUrl={formState.inputValues.imageUrl}
                onPress={() => {
                  setImgPickerModalVisible(true);
                }}
              />
              <View style={styles.uploadBtnContainer}>
                <UiButton
                  icon="upload"
                  label="Upload Image"
                  type="primary"
                  primaryClr={theme.buttonSecondaryBg}
                  secondaryClr={theme.buttonSecondaryText}
                  onPress={() => {
                    setImgPickerModalVisible(true);
                  }}
                  darkBg={false}
                  borderRadius={16}
                />
                {formState.inputValues.imageUrl ? (
                  <UiButton
                    icon="close"
                    type="primary"
                    primaryClr={theme.buttonSecondaryBg}
                    secondaryClr={theme.buttonSecondaryText}
                    onPress={() => {
                      clearImage();
                    }}
                    darkBg={false}
                    borderRadius={16}
                  />
                ) : null}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <UiButton
            onPress={() => {
              modifyAnnouncementScreenHandler();
            }}
            label="Create"
            width="100%"
            height={62}
            borderRadius={16}
            style={styles.button}
            primaryClr={theme.buttonPrimaryBg}
            secondaryClr={theme.buttonPrimaryText}
          />
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
        onCloseHandler={() => {
          setImgPickerModalVisible(false);
        }}
        icon="aperture-outline"
        closeable={true}
        onClose={() => {
          setImgPickerModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollviewContainer: {
    paddingTop: 0,
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalContainer: {
    height: '100%',
    backgroundColor: '#F2F2F2',
    paddingBottom: 55,
  },
  modalContentContainer: {
    width: '100%',
    height: '93%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalHeader: {
    padding: 15,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomColor: '#414141',
    // borderBottomWidth: 1,
    // borderStyle: 'solid',
  },
  modalBody: {
    padding: 15,
    paddingTop: 0,
    marginBottom: 56,
  },
  modalFooter: {
    padding: 15,
    backgroundColor: '#00000000',
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // backgroundColor: 'rgba(0, 0, 0, 0)',
    // padding: 3,
    // marginHorizontal: 10,
  },
  formHeading: {
    fontSize: 24,
  },
  formLabels: {
    color: '#A19EAE',
    fontSize: 15,
    marginTop: 30,
    marginBottom: 10,
  },
});

export default ModifyAnnouncementScreen;
