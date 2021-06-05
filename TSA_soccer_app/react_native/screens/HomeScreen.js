import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import AddButton from '../components/AddButton';
import * as ThemeActions from '../store/actions/ThemeActions';
import UiModal from '../components/UiModal';
import UiButton from '../components/UiButton';
import UiDropdown from '../components/UiDropdown';

const HomeScreen = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [visible, setVisible] = useState(false);
  const addBtnRef = useRef();
  const dispatch = useDispatch();
  const activeTheme = useSelector(state => state.theme.activeTheme);

  const onScrollHandler = event => {
    const prevOffsetY = offsetY;
    const curOffsetY = event.nativeEvent.contentOffset.y;
    if (Math.abs(curOffsetY - prevOffsetY) > 8) {
      if (curOffsetY < prevOffsetY) {
        addBtnRef.current.onScrollUp();
      } else {
        addBtnRef.current.onScrollDown();
      }
    }
    setOffsetY(curOffsetY);
  };

  const onChangeThemeHandler = event => {
    let newTheme;
    if (activeTheme === 'default') {
      newTheme = 'dark';
    } else if (activeTheme === 'dark') {
      newTheme = 'darkPlus';
    } else {
      newTheme = 'default';
    }
    dispatch(ThemeActions.updateTheme(newTheme));
  };

  return (
    <View style={styles.container}>
      <UiModal
        primaryLabel="Confirm"
        secondaryLabel="Cancel"
        visible={visible}
        title="Delete content"
        content={
          'Are you sure you want to remove this content? You can access this file for 7 days in your trash.'
        }
        onCloseHandler={() => {
          setVisible(false);
        }}
      />
      <Text>HomeScreen</Text>
      {/* <ScrollView onScroll={onScrollHandler}> */}
      <UiButton
        label="Change theme"
        textColor="white"
        bgColor="#0022FF"
        onPress={onChangeThemeHandler}
      />
      <UiButton
        label="Confirm"
        textColor="white"
        bgColor="#0066FF"
        onPress={() => {
          setVisible(true);
        }}
      />
      <UiDropdown />
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      <Text style={styles.text}>HomeScreen scroll</Text>
      {/* </ScrollView> */}
      <AddButton ref={addBtnRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 15,
    height: '100%',
    position: 'relative',
  },
  text: {
    margin: 50,
  },
});

export default HomeScreen;
