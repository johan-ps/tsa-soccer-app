import React, { useState, useReducer, useCallback } from 'react';
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

import { UiButton, UiDropdown, UiTextArea, UiModal } from './_components';
import * as announcementActions from '../store/actions/AnnouncementActions';

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

const CreateAnnouncement = props => {
  const { visible } = props;
  const theme = useSelector(state => state.theme.colors);
  const teams = [
    {
      label: 'House League',
      id: 0,
      children: [
        {
          label: 'Markham House League',
          id: 10,
        },
        {
          label: 'Scarborough House League',
          id: 17,
        },
      ],
    },
    {
      label: 'Rep',
      id: 1,
      children: [
        {
          label: 'U14',
          id: 13,
        },
        {
          label: 'U11',
          id: 14,
        },
        {
          label: 'U10',
          id: 15,
        },
        {
          label: 'U9',
          id: 16,
        },
      ],
    },
  ];
  const dispatch = useDispatch();

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
              },
              isValid: true,
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
              uri: `data:${img.mime};base64,` + img.data,
              width: img.width,
              height: img.height,
            },
            isValid: true,
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
                mime: img.mime,
              },
              isValid: true,
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
              uri: img.path,
              width: img.width,
              height: img.height,
              mime: img.mime,
            },
            isValid: true,
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
      isValid: true,
      input: 'imageUrl',
    });
  };

  const createAnnouncementHandler = async () => {
    await dispatch(
      announcementActions.addAnnouncement({
        title: '',
        description: formState.inputValues.description,
        image: formState.inputValues.imageUrl,
        teams: formState.inputValues.teams,
      }),
    );
    props.onClose();
    dispatchFormState({ type: 'reset' });
  };

  const onChangeText = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
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
          isValid: true,
          input: 'teams',
        });
      }
    },
    [dispatchFormState],
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: 'black' }]}>
        <View
          style={[
            styles.modalContentContainer,
            { backgroundColor: theme.neutralDarkGrey },
          ]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.formHeading, { color: theme.secondaryText }]}>
              Create an Announcement
            </Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              <UiTextArea id="description" onInputChange={onChangeText} />
              <Text style={styles.formLabels}>Team</Text>
              <UiDropdown
                onSelect={onSelectHandler}
                modalOffsetY={80}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
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
                    label="Delete Image"
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
              {formState.inputValues.imageUrl ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    style={styles.imagePreview}
                    source={formState.inputValues.imageUrl}
                    resizeMode="cover"
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <UiButton
            label="Cancel"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={props.onClose}
            darkBg={true}
          />
          <UiButton
            label="Create"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            secondaryClr={theme.buttonTertiaryBg}
            onPress={() => {
              createAnnouncementHandler();
            }}
            darkBg={true}
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
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    color: '#1E1E1E',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
  },
  formLabels: {
    color: '#A19EAE',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 30,
  },
  imagePreview: {
    width: '100%',
    height: 300,
  },
});

export default CreateAnnouncement;
