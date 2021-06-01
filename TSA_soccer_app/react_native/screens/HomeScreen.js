import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import AddButton from '../components/AddButton';

const HomeScreen = () => {

  const [offsetY, setOffsetY] = useState(0);
  const addBtnRef = useRef();

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

  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <ScrollView onScroll={onScrollHandler}>
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
