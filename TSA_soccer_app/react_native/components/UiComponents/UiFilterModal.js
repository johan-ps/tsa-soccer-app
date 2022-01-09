import React, {
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo,
  useState,
} from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatTeams } from '../../Util/utilities';
import { UiDropdown } from '../_components';
import UiDatePicker from './UiDatePicker';
import * as loaderActions from '../../store/actions/LoaderActions';
import * as announcementActions from '../../store/actions/AnnouncementActions';
import UiBottomSheet from './UiBottomSheet';
import { useFormik } from 'formik';

const UiFilterModal = forwardRef((props, ref) => {
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const [initTeams, setInitTeams] = useState([]);
  const [labelMapping, setLabelMapping] = useState({});
  const teams = useSelector(state => state.teams);

  useImperativeHandle(ref, () => ({
    snapToIndex,
    reset: secondaryBtnHandler,
  }));

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      startDate: null,
      endDate: null,
      teams: initTeams,
    },
    onSubmit: values => {
      primaryBtnHandler(values);
    },
  });

  const loadFilteredAnnouncements = useCallback(
    async filters => {
      try {
        dispatch(loaderActions.updateLoader(true));
        await dispatch(announcementActions.getFilteredAnnouncements(filters));
        props.onCloseHandler(false);
      } catch (error) {
        if (error && error.length > 0) {
          error.forEach(err => {
            formik.setFieldError(err.field, err.errCode);
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

  useEffect(() => {
    formik.setFieldValue('teams', initTeams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initTeams]);

  useEffect(() => {
    if (teams && teams.length > 0) {
      const formattedTeams = formatTeams(teams);
      const selectedTeams = [];
      const mapping = {};

      formattedTeams.forEach((option, i) => {
        selectedTeams.push(false);
        mapping[option.id] = i;
      });

      setLabelMapping(mapping);
      setInitTeams(selectedTeams);
    }
  }, [teams]);

  const primaryBtnHandler = values => {
    const selectedTeams = [];

    if (values && values.teams) {
      for (const key in labelMapping) {
        if (values.teams[labelMapping[key]]) {
          selectedTeams.push(key);
        }
      }
    }

    const filterData = {
      ...values,
      teams: selectedTeams,
    };

    props.onUpdateFilter(filterData);
    loadFilteredAnnouncements(filterData);
    formik.resetForm({ values });
    bottomSheetRef.current.closeSheet();
  };

  const secondaryBtnHandler = () => {
    formik.resetForm({
      values: {
        startDate: null,
        endDate: null,
        teams: initTeams,
      },
    });
  };

  const onCloseHandler = () => {
    if (formik.dirty) {
      formik.handleReset();
    }
    props.onCloseHandler();
  };

  const handleDropdownChange = values => {
    formik.setFieldValue('teams', values);
  };

  const handleStartDateChange = value => {
    formik.setFieldValue('startDate', value);
  };

  const handleEndDateChange = value => {
    formik.setFieldValue('endDate', value);
  };

  const headingStyle = {
    fontFamily: theme.fontMedium,
    color: theme.primaryText,
  };

  return (
    <UiBottomSheet
      bottomInset={Platform.OS === 'ios' ? 250 : 170}
      title="Filter"
      ref={bottomSheetRef}
      onCloseHandler={onCloseHandler}
      primaryBtnHandler={formik.handleSubmit}
      secondaryBtnHandler={secondaryBtnHandler}
      footerLabel="Apply Filter"
      secondaryLabel="Reset">
      <View style={styles.bottomSheetContent}>
        <View style={styles.subheadingContainer}>
          <Text style={[styles.subheading, headingStyle]}>Teams</Text>
        </View>
        <UiDropdown
          options={formatTeams(teams)}
          labelMapping={labelMapping}
          placeholder="Choose teams"
          onChange={handleDropdownChange}
          selectedValues={formik.values.teams}
          error={formik.errors.teams}
        />
        <View style={styles.marginTop}>
          <View style={styles.subheadingContainer}>
            <Text style={[styles.subheading, headingStyle]}>Start Date</Text>
          </View>
          <UiDatePicker
            placeholder="Select start date"
            onChange={handleStartDateChange}
            value={formik.values.startDate}
            error={formik.errors.startDate}
          />
        </View>
        <View style={styles.marginTop}>
          <View style={styles.subheadingContainer}>
            <Text style={[styles.subheading, headingStyle]}>End Date</Text>
          </View>
          <UiDatePicker
            placeholder="Select end date"
            onChange={handleEndDateChange}
            value={formik.values.endDate}
            error={formik.errors.endDate}
          />
        </View>
      </View>
    </UiBottomSheet>
  );
});

const styles = StyleSheet.create({
  subheadingContainer: {
    marginTop: 0,
    marginBottom: 15,
  },
  subheading: {
    fontSize: 16,
  },
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
    marginTop: 20,
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
