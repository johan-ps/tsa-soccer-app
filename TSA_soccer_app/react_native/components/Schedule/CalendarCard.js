import React, { useState, useRef, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import StatusIndicator from './StatusIndicator';

const CalendarCard = props => {
  const { onPress, item } = props;
  const calanderCard = useRef();
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const defaultOption = {
    label: 'Set Availability',
    color: theme.schCardAccent,
  };
  const options = [
    { id: 0, label: 'Going', icon: 'checkmark-done', color: '#4ce660' },
    { id: 1, label: 'Maybe', icon: 'help', color: '#a9a9a9' },
    { id: 2, label: 'Unavailable', icon: 'close', color: '#e84343' },
  ];
  const [availability, setAvailability] = useState(defaultOption);

  useEffect(() => {
    if(item.status){
      for(let option of options){
        if(option.label.toLowerCase() === item.status){
          setAvailability(option);
        }
      }
    }
  }, [props.item]);

  return (
    <TouchableOpacity
      onPress={onPress}
      ref={calanderCard}
      style={[
        styles.touchableContainer,
        { backgroundColor: availability.color },
      ]}
      activeOpacity={0.8}>
      <View
        style={[
          styles.container,
          {
            borderLeftColor: availability.color,
            backgroundColor: theme.schCardBg,
          },
        ]}>
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.heading,
              { fontFamily: theme.fontMedium, color: theme.primaryText },
            ]}>
            {item.type}
          </Text>
          <StatusIndicator
            label={availability.label}
            icon={availability.icon}
            color={availability.color}
            eventId={item.id}
          />
        </View>
        <View style={styles.itemContainer}>
          <Icon name="timer-outline" size={20} color={theme.secondaryText} />
          <Text
            style={[
              styles.itemContent,
              { color: theme.secondaryText, fontFamily: theme.fontRegular },
            ]}>
            {moment('May 15, 2021 ' + item.startTime).format('h:mm')} - {moment('May 15, 2021 ' + item.endTime).format('h:mm')}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <Icon name="navigate-outline" size={20} color={theme.secondaryText} />
          <Text
            style={[
              styles.itemContent,
              { color: theme.secondaryText, fontFamily: theme.fontRegular },
            ]}>
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    elevation: 4,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 1 },
    zIndex: 100,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    padding: 20,
    paddingLeft: 30,
    borderLeftWidth: 2,
    borderStyle: 'solid',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 2,
  },
  heading: {
    fontSize: 18,
  },
  itemContent: {
    fontSize: 14,
    marginLeft: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
    width: '100%',
    borderRadius: 10,
  },
});

export default CalendarCard;
