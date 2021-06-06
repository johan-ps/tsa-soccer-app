import React from 'react';
import { Text, View, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

import { UiButton, UiDropdown, UiToggle } from '../components/_components';

const CreateEvent = () => {
  const theme = useSelector(state => state.theme.colors);
  return (
    <Modal transparent={true} animationType="slide" statusBarTranslucent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContentContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.formHeading}>Create an Event</Text>
          </View>
          <ScrollView style={styles.scrollviewContainer} decelerationRate="fast">
            <View style={styles.modalBody}>
              <UiToggle labelLeft="Game" labelRight="Practice" />
              <Text style={styles.formLabels}>Date</Text>

            </View>
          </ScrollView>
        </View>
        <View style={styles.modalFooter}>
          <UiButton
            label="Cancel"
            bgColor={theme.secondaryBtnBgClr}
            textColor={theme.secondaryBtnClr}
            onPress={() => {}}
          />
          <UiButton
            label="Create"
            bgColor={theme.primaryBtnBgClr}
            textColor={theme.primaryBtnClr}
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
    backgroundColor: 'grey',
  },
  modalContentContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  modalHeader: {
    padding: 30,
  },
  modalBody: {
    padding: 30,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 20,
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
  },
});

export default CreateEvent;
