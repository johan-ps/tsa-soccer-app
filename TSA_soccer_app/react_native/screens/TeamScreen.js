import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import AddButton from '../components/AddButton';
import PlayerListItem from '../components/Schedule/PlayerListItem';
import { useSelector } from 'react-redux';

const TeamScreen = ({ navigation }) => {
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

  const coachesList = [
    {
      id: 0,
      name: 'Nick Nurse',
      image:
        'https://www.gannett-cdn.com/presto/2019/05/30/USAT/603d8193-04c1-4261-ad4e-2a58497af5f1-GTY_1150410766.JPG',
      last: true,
    },
  ];

  const theme = useSelector(state => state.theme.colors);

  return (
    <View>
      <ScrollView style={[styles.container, {backgroundColor: theme.searchBg}]}>
        <View style={[styles.subContainer, {backgroundColor: theme.schBg}]}>
          <Text style={[styles.subHeading, {color:theme.cardHClr}]}>
            U8 Markham Houseleague
          </Text>
        </View>
        <Text style={[styles.listHeading, {backgroundColor: theme.moreScreenSettingsBgClr}]}>Coaches - {coachesList.length}</Text>
        <View style={styles.subContainer}>
          {coachesList.map(player => (
            <PlayerListItem
              player={player}
              navigation={navigation}
              key={player.id}
            />
          ))}
        </View>
        <Text style={[styles.listHeading, {backgroundColor: theme.moreScreenSettingsBgClr}]}>Players - {playersList.length}</Text>
        <View style={styles.subContainer}>
          {playersList.map((player, index) => (
            <PlayerListItem
              key={player.id + index + 1}
              player={player}
              navigation={navigation}
            />
          ))}
        </View>
        {/* <Text style={styles.listHeading}>Going</Text>
        <View style={styles.subContainer}>
          <TeamScrollList players={playersList} />
        </View> */}
      </ScrollView>
      <AddButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  subContainer: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontSize: 20,
    paddingTop: 50,
    paddingHorizontal: 15,
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 16,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
    fontWeight: '600'
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0',
    color: '#696969'
  },
});

export default TeamScreen;
