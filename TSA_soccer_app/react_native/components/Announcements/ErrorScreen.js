import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

import CONST from '../../constants/Constants';
import UiButton from '../UiComponents/UiButton';

const ErrorScreen = props => {
  const { error } = props;
  const theme = useSelector(state => state.theme.colors);

  const getHeading = useMemo(() => {
    let heading;
    if (error === CONST.NO_RESULTS) {
      heading = CONST.NO_RESULTS_HEADING;
    } else if (error === CONST.NO_INTERNET) {
      heading = CONST.NO_INTERNET_HEADING;
    }
    return heading;
  }, [error]);

  const getSubHeading = useMemo(() => {
    let subheading;
    if (error === CONST.NO_RESULTS) {
      subheading = CONST.NO_RESULTS_SUBHEADING;
    } else if (error === CONST.NO_INTERNET) {
      subheading = CONST.NO_INTERNET_SUBHEADING;
    }
    return subheading;
  }, [error]);

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBg }]}>
      <View style={styles.imageContainer}>
        {error === CONST.NO_RESULTS ? (
          <Image
            style={styles.image}
            source={require('../../assets/img/search-text.png')}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={styles.image}
            source={require('../../assets/img/internet-slash.png')}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.heading,
            { color: theme.secondaryText, fontFamily: theme.fontBold },
          ]}>
          {getHeading}
        </Text>
        <Text
          style={[
            styles.subHeading,
            { color: theme.primaryText, fontFamily: theme.fontRegular },
          ]}>
          {getSubHeading}
        </Text>
      </View>
      <UiButton
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ marginTop: 30 }}
        icon="reload1"
        label="Refresh"
        type="primary"
        primaryClr={theme.buttonSecondaryBg}
        secondaryClr={theme.buttonSecondaryText}
        onPress={props.onRefresh}
        darkBg={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  imageContainer: {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 60,
    marginVertical: 20,
  },
  subHeading: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 30,
  },
});

export default memo(ErrorScreen);
