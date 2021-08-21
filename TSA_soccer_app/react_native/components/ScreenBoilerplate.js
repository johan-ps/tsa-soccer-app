import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UiIconButton } from '../components/_components';

const ScreenBoilerplate = props => {
  const { tabBarVisible = true } = props;
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.heading}>
        <View style={styles.nav}>
          {props.navLeft ? (
            <Icon
              name="chevron-back-outline"
              size={35}
              color={props.headingClr}
              onPress={props.navActionLeft}
            />
          ) : null}
          {props.navRight ? (
            <UiIconButton
              icon={props.navRight}
              size={26}
              color={props.navRightText}
              backgroundColor={props.navRightBg}
              shadow
              onPress={props.navActionRight}
            />
          ) : null}
        </View>
        {props.heading ? (
          <Text style={[styles.headingText, { color: props.headingClr }]}>
            {props.heading}
          </Text>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={[styles.content, !tabBarVisible ? { marginBottom: 0 } : {}]}>
        {props.children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  heading: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingLeft: 40,
  },
  nav: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headingText: {
    color: 'white',
    fontFamily: 'Roboto-Medium',
    fontSize: 40,
    marginTop: 20,
    lineHeight: 40,
  },
  content: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingLeft: 40,
    marginBottom: 75,
  },
  contentContainer: {
    paddingBottom: 35,
  },
});

export default ScreenBoilerplate;
