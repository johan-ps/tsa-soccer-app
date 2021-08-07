import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  UiInput,
  ScreenBoilerplate,
} from '../components/_components';

const EditProfileScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);

  return (
    <ScreenBoilerplate
      headingClr={theme.primaryText}
      heading="Account"
      navLeft
      navRight="checkmark"
      style={{ backgroundColor: theme.navBg }}
      navActionLeft={() => {
        navigation.goBack();
      }}>
      <View style={styles.container}>
          <View style={styles.fieldContainer}>
            <Text>Name</Text>
            <View style={styles.field}>
                <UiInput />
            </View>
          </View>
      </View>
    </ScreenBoilerplate>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  fieldContainer: {},
  field: {},
});

export default EditProfileScreen;
