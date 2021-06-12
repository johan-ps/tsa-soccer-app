import React from 'react';
import { Text, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import {
  UiButton,
  UiDropdown,
  UiToggle,
  UiInput,
} from '../components/_components';

const CreateEvent = props => {
  const { visible } = props;
  const theme = useSelector(state => state.theme.colors);
  const startTime = [
    { id: 0, label: '01:00' },
    { id: 1, label: '02:00' },
    { id: 2, label: '03:00' },
    { id: 3, label: '04:00' },
    { id: 4, label: '05:00' },
    { id: 5, label: '06:00' },
    { id: 6, label: '07:00' },
    { id: 7, label: '08:00' },
    { id: 8, label: '09:00' },
    { id: 9, label: '10:00' },
    { id: 10, label: '11:00' },
    { id: 11, label: '12:00' },
  ];
  const endTime = [
    { id: 12, label: '01:00' },
    { id: 13, label: '02:00' },
    { id: 14, label: '03:00' },
    { id: 15, label: '04:00' },
    { id: 16, label: '05:00' },
    { id: 17, label: '06:00' },
    { id: 18, label: '07:00' },
    { id: 19, label: '08:00' },
    { id: 20, label: '09:00' },
    { id: 21, label: '10:00' },
    { id: 22, label: '11:00' },
    { id: 23, label: '12:00' },
  ];
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
  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.formHeading}>Create an Event</Text>
          </View>
          <ScrollView
            style={styles.scrollviewContainer}
            decelerationRate="fast">
            <View style={styles.modalBody}>
              <UiInput
                placeholder="Title"
                borderTheme="underline"
                fontSize={20}
                style={{ marginBottom: 20 }}
              />
              <UiToggle labelLeft="Game" labelRight="Practice" />
              <Text style={styles.formLabels}>Date</Text>
              <UiInput
                placeholder="Thursday, 24 Nov 2020"
                borderTheme="circle"
                fontSize={14}
                icon="calendar-outline"
                style={{ marginBottom: 10 }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <UiDropdown
                  modalOffsetY={305}
                  modalOffsetX={30}
                  options={startTime}
                  placeholder="Start"
                  size="small"
                />
                <UiDropdown
                  modalOffsetY={305}
                  modalOffsetX={30}
                  options={endTime}
                  placeholder="End"
                  size="small"
                />
              </View>
              <Text style={styles.formLabels}>Location</Text>
              <UiInput
                placeholder="123 Ramerville Dr."
                borderTheme="circle"
                fontSize={14}
                icon="location-outline"
                style={{ marginBottom: 10 }}
              />
              <Text style={styles.formLabels}>Team</Text>
              <UiDropdown
                modalOffsetY={80}
                modalOffsetX={0}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
              />
            </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <UiButton
            label="Cancel"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            onPress={props.onClose}
          />
          <UiButton
            label="Create"
            type="tertiary"
            primaryClr={theme.buttonTertiaryText}
            onPress={() => {}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollviewContainer: {
    // width: '100%',
    // height: '100%',
    // backgroundColor: 'white',
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
    fontSize: 28,
    fontWeight: 'bold',
    // textShadowOffset: {width: 2, height: 2},
    // textShadowRadius: 10,
    // textShadowColor: '#dadada',
  },
  formLabels: {
    color: '#A19EAE',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
});

export default CreateEvent;