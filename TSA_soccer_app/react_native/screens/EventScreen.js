import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import TeamScrollList from '../components/TeamScrollList';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';


const MessagesScreen = ({ navigation }) => {
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

  const theme = useSelector(state => state.theme.colors);


  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon
          name="chevron-back-outline"
          size={35}
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text style={styles.text}>Game</Text>
      <View>
        <View>
          <Text>Date</Text>
        </View>
        <View>
          <Text>15 May</Text>
          <Text>Wednesday</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Time</Text>
        </View>
        <View>
          <Text>5:30 pm</Text>
          <Text>to 6:30 pm</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Location</Text>
        </View>
        <View>
          <Text>ScotiaBank Arena</Text>
          <Text>40 Bay St.</Text>
          <Text>Toronto, ON</Text>
          <Text>M5J 2X2</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Jersey Colour</Text>
        </View>
        <View>
          <Text>Black</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Opponent</Text>
        </View>
        <View>
          <Text>Toronto Raptors</Text>
        </View>
      </View>
      <Text style={[styles.listHeading, { backgroundColor: '#2ad121' }]}>Going</Text>
      <TeamScrollList players={playersList} />
      <Text style={[styles.listHeading, { backgroundColor: '#A9A9A9' }]}>Maybe</Text>
      <TeamScrollList players={playersList} />
      <Text style={[styles.listHeading, { backgroundColor: '#e63c44' }]}>Unavailable</Text>
      <TeamScrollList players={playersList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  headerContainer: {
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  text: {
    color: 'red',
  },
  iconContainer: {
    marginVertical: 10,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0',
    color: '#696969'
  },
  verticalLine: {
    width: 1,
    height: 100,
    backgroundColor: '#A9A9A9',
    marginTop: 40,
    marginLeft: 70,
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profilePictureContainer: {
    borderRadius: 60,
    borderColor: 'red',
    borderWidth: 3,
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 0, 13, 0.1)',
    left: 20,
  },
  playerNameContainer: {
    flexDirection: 'column',
    width: '100%',
    left: 50,
  },
  playerFirstName: {
    fontSize: 40,
    fontWeight: '600',
    width: 150
  },
  playerLastName: {
    fontSize: 40,
    color: '#A9A9A9',
  },
});

export default MessagesScreen;
