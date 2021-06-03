import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import AddButton from '../components/AddButton';
import * as ThemeActions from '../store/actions/ThemeActions';

const HomeScreen = () => {
  const [offsetY, setOffsetY] = useState(0);
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
  }

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <ScrollView onScroll={onScrollHandler}>
        <Button title="Change theme" onPress={onChangeThemeHandler} />
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
      </ScrollView>
      <AddButton ref={addBtnRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    height: '100%',
  },
  text: {
    margin: 50,
  },
});

export default HomeScreen;
