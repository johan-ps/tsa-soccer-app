import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
import ScheduleHeaderItem from './ScheduleHeaderItem';

const ScheduleClock = props => {
  const theme = useSelector(state => state.theme.colors);
  const DEG_BETWEEN_HANDS = 6;
  const [clockHandPositions, setClockHandPositions] = useState([]);

  useEffect(() => {
    let clockHands = [];
    for (let i = 0; i < 30; ++i) {
      if (i % 5 === 0) {
        clockHands.push(
          <View
            style={[
              styles.clockLine,
              { transform: [{ rotate: i * DEG_BETWEEN_HANDS + 'deg' }] },
            ]}
          />,
        );
        clockHands.push(
          <View
            style={[
              styles.clockLineCover,
              {
                transform: [{ rotate: i * DEG_BETWEEN_HANDS + 'deg' }],
                backgroundColor: theme.primaryBg,
              },
            ]}
          />,
        );
      } else {
        clockHands.push(
          <View
            style={[
              styles.clockLineSmall,
              { transform: [{ rotate: i * DEG_BETWEEN_HANDS + 'deg' }] },
            ]}
          />,
        );
        clockHands.push(
          <View
            style={[
              styles.clockLineCoverSmall,
              {
                transform: [{ rotate: i * DEG_BETWEEN_HANDS + 'deg' }],
                backgroundColor: theme.primaryBg,
              },
            ]}
          />,
        );
      }
    }
    setClockHandPositions(clockHands);
  }, [theme]);

  return (
    <View style={[styles.clockContainer, { backgroundColor: theme.primaryBg }]}>
      {clockHandPositions}
      <View style={styles.infoHeaderContainer}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.infoTextTop}>
            5:30 <Text style={{ fontSize: 12 }}>pm</Text>
          </Text>
          <Text style={styles.infoTextBottom}>- 6:30 pm</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoHeaderContainer: {
    flexDirection: 'row',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45,
    backgroundColor: '#dedede',
  },
  clockContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockLine: {
    height: 130,
    width: 1,
    position: 'absolute',
    backgroundColor: 'rgba(143, 143, 143, 0.7)',
  },
  clockLineSmall: {
    height: 130,
    width: 1,
    position: 'absolute',
    backgroundColor: 'rgba(143, 143, 143, 0.4)',
  },
  clockLineCoverSmall: {
    height: 115,
    width: 3,
    position: 'absolute',
    backgroundColor: 'black',
  },
  clockLineCover: {
    height: 105,
    width: 3,
    position: 'absolute',
    backgroundColor: 'black',
  },
  infoTextTop: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'left',
    color: 'black',
  },
  infoTextBottom: {
    fontSize: 10,
    color: '#ebe8e8',
    textAlign: 'left',
    color: 'black',
  },
});

export default ScheduleClock;
