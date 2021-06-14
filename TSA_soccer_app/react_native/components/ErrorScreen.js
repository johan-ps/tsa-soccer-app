import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

import CONST from '../constants/Constants';

const ErrorScreen = props => {
  const { error } = props;
  const theme = useSelector(state => state.theme.colors);

  const getImgPath = () => {
    let path;
    if (error === CONST.NO_RESULTS) {
      path = '../assets/img/magnifying-glass.png';
    } else if (error === CONST.NO_INTERNET) {
      path = '../assets/img/internet-slash.png';
    }
    return path;
  };

  const getHeading = (() => {
    let heading;
    if (error === CONST.NO_RESULTS) {
      heading = CONST.NO_RESULTS_HEADING;
    } else if (error === CONST.NO_INTERNET) {
      heading = CONST.NO_INTERNET_HEADING;
    }
    return heading;
  })();

  const getSubHeading = (() => {
    let subheading;
    if (error === CONST.NO_RESULTS) {
      subheading = CONST.NO_RESULTS_SUBHEADING;
    } else if (error === CONST.NO_INTERNET) {
      subheading = CONST.NO_INTERNET_SUBHEADING;
    }
    return subheading;
  })();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {error === CONST.NO_RESULTS ? (
          <Image
            style={styles.image}
            source={require(`../assets/img/magnifying-glass.png`)}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={styles.image}
            source={require(`../assets/img/internet-slash.png`)}
            resizeMode="cover"
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.heading, { color: theme.secondaryText }]}>
          {getHeading}
        </Text>
        <Text style={[styles.subHeading, { color: theme.primaryText }]}>
          {getSubHeading}
        </Text>
      </View>
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
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
    lineHeight: 60,
    marginVertical: 20,
  },
  subHeading: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    lineHeight: 30,
  },
});

export default ErrorScreen;
