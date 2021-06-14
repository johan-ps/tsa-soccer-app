import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';
import TeamScrollList from '../components/TeamScrollList'

const MessagesScreen = () => {

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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details</Text>
      <Text>Location</Text>
      
      <Text>Going</Text>
      <TeamScrollList players={playersList}/>
      <Text>Maybe</Text>
      <TeamScrollList players={playersList}/>
      <Text>Unavailable</Text>
      <TeamScrollList players={playersList}/>
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
    color: 'red'
  }
});

export default MessagesScreen;
