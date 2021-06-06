import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import AddButton from '../components/AddButton';
import PlayerListItem from '../components/PlayerListItem';
import { useSelector } from 'react-redux';
import TeamScrollList from '../components/TeamScrollList';

const TeamScreen = ({navigation}) => {

  const playersList = [
    {name: 'Kyrie Irving', image:"https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg"},
    {name: 'Fred Vanvleet', image:"https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTgwMzAwNzYzMjEyMjkzOTk2/usatsi_15834400_168390270_lowres-1.jpg"},
    {name: 'Og Anunoby', image:"https://smartcdn.prod.postmedia.digital/torontosun/wp-content/uploads/2021/03/OGSUNS-scaled-e1616862876391.jpg?quality=100&strip=all"},
    {name: 'Kyle Lowry', image:'https://www.si.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTY4MDA3MjExNzU3Njc1Nzkz/kyle_lowry_raptors_parade_jpg.jpg'},
    {name: 'Kawhi Leonard', image:"https://pbs.twimg.com/media/Dn3eeqBU0AI80LY.jpg"}
  ]

  const coachesList = [
    {name: 'Nick Nurse', image:"https://www.gannett-cdn.com/presto/2019/05/30/USAT/603d8193-04c1-4261-ad4e-2a58497af5f1-GTY_1150410766.JPG", last:true}
  ]


  const theme = useSelector(state => state.theme.colors);

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>Team Roster</Text>
        <Text style={styles.subHeading}>Toronto Soccer Association U13 Rep</Text>
      </View>
      <Text style={styles.listHeading}>Coaches - {coachesList.length}</Text>
      <View style={styles.subContainer}>
        {coachesList.map((player, index) => (
          <PlayerListItem 
            player={player}
            navigation={navigation}
          />
        ))} 
      </View>
      <Text style={styles.listHeading}>Players - {playersList.length}</Text>
      <View style={styles.subContainer}>
        {playersList.map((player, index) => (
          <PlayerListItem 
            player={player}
            navigation={navigation}
          />
        ))} 
      </View>
      <Text style={styles.listHeading}>Going</Text>
      <View style={styles.subContainer}>
        <TeamScrollList
          players={playersList}
        />
      </View>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  subContainer: {
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  heading: {
    color: 'red',
    fontSize: 40,
    paddingTop: 50,
    fontWeight: '600'
  },
  subHeading: {
    fontSize: 20,
    paddingBottom: 40,
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0'
  }
});

export default TeamScreen;
