import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { UiButton, UiDropdown, UiInput } from '../components/_components';
import ImageUpload from '../components/Announcements/ImageUpload';
import * as announcementActions from '../store/actions/AnnouncementActions';
import * as loaderActions from '../store/actions/LoaderActions';
import * as teamActions from '../store/actions/TeamActions';
import { formatTeams } from '../Util/utilities';
import * as tabbarActions from '../store/actions/TabbarActions';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTeamsFromAnnouncement } from '../api/announcements';
import { useFormik } from 'formik';

const ModifyAnnouncementScreen = props => {
  const { navigation } = props;
  const theme = useSelector(state => state.theme.colors);
  const teams = useSelector(state => formatTeams(state.teams));
  const dispatch = useDispatch();
  const userData = useSelector(state => state.userData);
  const [labelMapping, setLabelMapping] = useState({});
  const { isEdit } = props.route.params;
  const { announcementData } = props.route.params;
  const [initTeams, setInitTeams] = useState([]);

  useEffect(() => {
    const selectedTeams = [];
    const mapping = {};

    teams.forEach((option, i) => {
      selectedTeams.push(false);
      mapping[option.id] = i;
    });

    setLabelMapping(mapping);
    setInitTeams(selectedTeams);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      imageUrl: null,
      description: '',
      teams: initTeams,
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  useEffect(() => {
    formik.setFieldValue('teams', initTeams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTeams]);

  const loadTeamsFromAnnouncements = useCallback(async () => {
    return await getTeamsFromAnnouncement(announcementData.id);
  }, [announcementData]);

  useEffect(() => {
    if (isEdit) {
      dispatch(loaderActions.updateLoader(true));
      loadTeamsFromAnnouncements()
        .then(res => {
          if (res && res.length > 0) {
            const teamsArr = [...initTeams];

            res.forEach(({ teamId }) => {
              teamsArr[labelMapping[teamId.toString()]] = true;
            });

            setInitTeams(teamsArr);
          }
        })
        .finally(() => {
          dispatch(loaderActions.updateLoader(false));
        });
    }
  }, [loadTeamsFromAnnouncements, isEdit, dispatch, initTeams, labelMapping]);

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

  const modifyAnnouncementScreenHandler = async values => {
    formik.handleSubmit();
    dispatch(loaderActions.updateLoader(true));
    try {
      const selectedTeams = [];
      for (const key in labelMapping) {
        if (values.teams[labelMapping[key]]) {
          selectedTeams.push(key);
        }
      }

      const updateData = {
        title: '',
        description: values.description,
        image: values.imageUrl,
        teams: JSON.stringify(selectedTeams),
        authorId: userData.id,
      };

      if (isEdit) {
        updateData.id = announcementData.id;
      }

      await dispatch(
        isEdit
          ? announcementActions.updateAnnouncement(updateData)
          : announcementActions.addAnnouncement(updateData),
      );
      await dispatch(announcementActions.getAnnouncements());
      navigation.goBack();
      formik.resetForm();
    } catch (error) {
      if (error && error.length > 0) {
        error.forEach(err => {
          formik.setFieldError(err.field, err.errCode);
        });
      }
    } finally {
      dispatch(loaderActions.updateLoader(false));
    }
  };

  const onCloseHandler = () => {
    formik.resetForm();
    navigation.goBack();
  };

  const handleDropdownChange = values => {
    formik.setFieldValue('teams', values);
  };

  const handleImageChange = (imageUrl = null) => {
    formik.setFieldValue('imageUrl', imageUrl);
  };

  const labelFont = {
    fontFamily: theme.fontMedium,
    color: theme.secondaryText,
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.secondaryBg }}>
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
                {isEdit ? 'Update Announcement' : 'Create Announcement'}
              </Text>
              <TouchableOpacity
                onPress={onCloseHandler}
                style={styles.iconContainer}>
                <Icon
                  name="close-outline"
                  color={theme.primaryText}
                  size={36}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scrollviewContainer}
              decelerationRate="fast">
              <View style={styles.modalBody}>
                <Text style={[styles.formLabels, labelFont]}>Description</Text>
                <UiInput
                  id="description"
                  placeholder="Description"
                  multiline={true}
                  onChangeText={formik.handleChange('description')}
                  value={formik.values.description}
                  error={formik.errors.description}
                />
                <Text style={[styles.formLabels, labelFont]}>Team</Text>
                <UiDropdown
                  id="teams"
                  options={teams}
                  labelMapping={labelMapping}
                  multiselect={true}
                  group={true}
                  placeholder="Choose teams"
                  onChange={handleDropdownChange}
                  selectedValues={formik.values.teams}
                  error={formik.errors.teams}
                />
                <Text style={[styles.formLabels, labelFont]}>Upload Image</Text>
                <ImageUpload
                  onChange={handleImageChange}
                  imgUrl={formik.values.imageUrl}
                  error={formik.errors.imageUrl}
                />
                <View style={styles.uploadBtnContainer}>
                  <UiButton
                    icon="upload"
                    label="Upload Image"
                    type="primary"
                    primaryClr={theme.buttonSecondaryBg}
                    secondaryClr={theme.buttonSecondaryText}
                    onPress={() => {}}
                    darkBg={false}
                    borderRadius={16}
                  />
                  {formik.values.imageUrl ? (
                    <UiButton
                      icon="close"
                      type="primary"
                      primaryClr={theme.buttonSecondaryBg}
                      secondaryClr={theme.buttonSecondaryText}
                      onPress={() => {
                        handleImageChange(null);
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
              label={isEdit ? 'Update' : 'Create'}
              width="100%"
              height={62}
              borderRadius={16}
              style={styles.button}
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr={theme.buttonPrimaryText}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
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
