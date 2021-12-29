import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import StatusIndicator from './StatusIndicator';
import TeamListPreview from './TeamListPreview';

const playersList = [
  {
    id: 0,
    name: 'Kyrie Irving',
    image:
      'https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg',
  },
  {
    id: 1,
    name: 'Fred Vanvleet',
    image:
      'https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTgwMzAwNzYzMjEyMjkzOTk2/usatsi_15834400_168390270_lowres-1.jpg',
  },
  {
    id: 2,
    name: 'Og Anunoby',
    image:
      'https://smartcdn.prod.postmedia.digital/torontosun/wp-content/uploads/2021/03/OGSUNS-scaled-e1616862876391.jpg?quality=100&strip=all',
  },
  {
    id: 3,
    name: 'Kyle Lowry',
    image:
      'https://www.si.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTY4MDA3MjExNzU3Njc1Nzkz/kyle_lowry_raptors_parade_jpg.jpg',
  },
  {
    id: 4,
    name: 'Kawhi Leonard',
    image: 'https://pbs.twimg.com/media/Dn3eeqBU0AI80LY.jpg',
    last: true,
  },
];

const ScheduleCardSmall = props => {
  const { onPress, event } = props;
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const defaultOption = {
    label: 'Set Availability',
    icon: 'information-outline',
    color: theme.schCardAccent,
  };
  const options = [
    { id: 0, label: 'Going', icon: 'checkmark-done', color: '#4ce660' },
    { id: 1, label: 'Maybe', icon: 'help', color: '#a9a9a9' },
    { id: 2, label: 'Unavailable', icon: 'close', color: '#e84343' },
  ];
  const [availability, setAvailability] = useState(defaultOption);
  const [playerList, setPlayerList] = useState([]);

  useEffect(() => {
    if(event.status === null){
      setAvailability(defaultOption);
    }
    else{
      for(let option of options){
        if(option.label.toLowerCase() === event.status){
          setAvailability(option);
        }
      }
    }
    if(event.availabilities){
      setPlayerList(event.availabilities);
    }
  }, [props.event]);

  const editEvents = (event) => {
  //   navigation.navigate('CreateEvent', {
  //     type: event.type,
  //     selectedDate: selectedDate,
  //     event: event
  //   });
  // } else if (buttonIndex === 2) {
  //   // DELETE EVENT
  // }
    
    
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.touchableContainer,
        {
          backgroundColor: availability.color,
        },
      ]}
      activeOpacity={0.8}>
      <View
        style={[
          styles.cardContainer,
          {
            borderTopColor: availability.color,
            backgroundColor: theme.schCardBg,
          },
        ]}>
        <View style={styles.header}>
          <View>
            <Text
              style={[
                styles.monday,
                { color: theme.schCardText, fontFamily: theme.fontRegular },
              ]}>
              {moment(event.date).format('MMM')}
            </Text>
            <Text
              style={[
                styles.date,
                { color: theme.schCardText, fontFamily: theme.fontMedium },
              ]}>
              {moment.utc(event.date).format('DD')}
            </Text>
          </View>
          {userData.authenticated ?
            <StatusIndicator
              label={availability.label}
              icon={availability.icon}
              color={availability.color}
              size="small"
              eventId={event.id}
            />
            :
            null
          }
        </View>
        <View style={styles.body}>
          <Text
            style={[
              styles.type,
              { color: theme.schCardText, fontFamily: theme.fontRegular },
            ]}>
            {event.type}
          </Text>
        </View>
        <View style={styles.infoHeaderContainer}>
          <Text
            style={[
              styles.time,
              { color: theme.schCardText, fontFamily: theme.fontLight },
            ]}>
              {moment('May 15, 2021 ' + event.startTime).format('hh:mm A')} - {moment('May 15, 2021 ' + event.endTime).format('hh:mm A')}
          </Text>
        </View>
        <TeamListPreview players={playerList} size={35} max={3} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 230,
    width: 160,
    borderRadius: 10,
    elevation: 4,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 1 },
    zIndex: 100,
    marginHorizontal: 10,
  },
  cardContainer: {
    height: 230,
    width: 160,
    padding: 20,
    borderTopWidth: 2,
    borderStyle: 'solid',
    borderRadius: 10,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blurContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  body: {
    width: '100%',
    marginTop: 6,
  },
  month: {
    fontSize: 12,
  },
  date: {
    fontSize: 24,
  },
  time: {
    fontSize: 13,
  },
  type: {
    fontSize: 20,
  },
  container: {
    flexDirection: 'column',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 22,
    textAlign: 'left',
    paddingLeft: 20,
    paddingTop: 0,
  },
  availableIcon: {
    width: '100%',
    flexDirection: 'row',
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingRight: 10,
    width: 150,
  },
  infoTextTop: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    color: 'black',
  },
  infoTextBottom: {
    fontSize: 12,
    color: '#ebe8e8',
    textAlign: 'left',
  },
  versus: {
    fontSize: 12,
    paddingLeft: 20,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: 16,
  },
  bottomHighlight: {
    backgroundColor: 'grey',
    height: 40,
    width: 80,
    borderRadius: 20,
  },
});

export default ScheduleCardSmall;
