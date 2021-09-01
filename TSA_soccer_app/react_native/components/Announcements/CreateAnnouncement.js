import React, { useState, useReducer, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  UiButton,
  UiDropdown,
  UiTextArea,
  UiModal,
  UiInput,
} from '../_components';
import ImageUpload from './ImageUpload';
import * as announcementActions from '../../store/actions/AnnouncementActions';
import * as loaderActions from '../../store/actions/LoaderActions';
import * as teamActions from '../../store/actions/TeamActions';
import { formatTeams } from '../../Util/utilities';

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

const CreateAnnouncement = props => {
  const { visible } = props;
  const theme = useSelector(state => state.theme.colors);
  const teams = useSelector(state => formatTeams(state.teams));
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);

  const [imgPickerModalVisible, setImgPickerModalVisible] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

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
          console.log('received base64 img');
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
          console.log('received image', img);
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
    loadTeams();
  }, [dispatch, loadTeams]);

  const createAnnouncementHandler = async () => {
    dispatch(loaderActions.updateLoader(true));
    try {
      const teamsParams = [];
      if (formState.inputValues.teams) {
        for (const groupId in formState.inputValues.teams) {
          for (const teamId in formState.inputValues.teams[groupId].children) {
            if (formState.inputValues.teams[groupId].children[teamId]) {
              teamsParams.push(teamId);
            }
          }
        }
      }
      await dispatch(
        announcementActions.addAnnouncement({
          title: '',
          description: formState.inputValues.description,
          image: formState.inputValues.imageUrl,
          teams: JSON.stringify(teamsParams),
          authorId: userData.id,
        }),
      );
      await dispatch(announcementActions.getAnnouncements());
      props.onClose();
      dispatchFormState({ type: 'reset' });
    } catch (error) {
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
          for (let teamId in group) {
            selectedTeams.push(teamId);
          }
        }

        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: inputValue,
          input: 'teams',
          isValid: true,
        });
      }
    },
    [dispatchFormState],
  );

  const onCloseHandler = () => {
    dispatchFormState({ type: 'reset' });
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide">
      <View
        style={[styles.modalContainer, { backgroundColor: theme.secondaryBg }]}>
        <View
          style={[
            styles.modalContentContainer,
            { backgroundColor: theme.secondaryBg },
          ]}>
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.formHeading,
                { color: theme.primaryText, fontFamily: theme.fontRegular },
              ]}>
              Create Announcement
            </Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              <UiInput
                id="description"
                initialValue={formState.inputValues.description}
                isValid={formState.inputValidities.description}
                errCode={formState.errors.description}
                placeholder="Description"
                multiline={true}
                onInputChange={onChangeText}
                bg={theme.inputBg}
                color={theme.inputText}
                placeholderClr={theme.inputPlaceholder}
                cursor={theme.cursor}
              />
              <Text style={styles.formLabels}>Team</Text>
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
              <Text style={styles.formLabels}>Upload Image</Text>
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
                />
                {formState.inputValues.imageUrl ? (
                  <UiButton
                    icon="close"
                    // label="Delete Image"
                    type="primary"
                    primaryClr={theme.buttonSecondaryBg}
                    secondaryClr={theme.buttonSecondaryText}
                    onPress={() => {
                      clearImage();
                    }}
                    darkBg={false}
                  />
                ) : null}
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
            onPress={onCloseHandler}
            darkBg={theme.name === 'dark'}
          />
          <UiButton
            label="Create"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={() => {
              createAnnouncementHandler();
            }}
            darkBg={theme.name === 'dark'}
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollviewContainer: {
    paddingTop: 30,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  modalContainer: {
    height: '100%',
    backgroundColor: '#F2F2F2',
  },
  modalContentContainer: {
    width: '100%',
    height: '93%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  modalHeader: {
    padding: 30,
    marginTop: 20,
    borderBottomColor: '#414141',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  modalBody: {
    padding: 30,
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
    fontSize: 14,
    marginTop: 30,
    marginBottom: 10,
  },
});

export default CreateAnnouncement;
