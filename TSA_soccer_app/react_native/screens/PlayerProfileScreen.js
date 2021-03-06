import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  Pressable,
  TouchableOpacity,
  Linking
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import call from 'react-native-phone-call'


const PlayerProfileScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const [border, setBorder] = useState(0)

  const phoneCallArgs = {
    number: '6479882710', // String value with the number to call
    prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call 
  }

  useEffect(() => {
    setTimeout(() => setBorder(0.8), 400)
  }, []);

  // TODO: add name, team, number, position, contact info (email, number)

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.searchBg },
      ]}>
      {/* TODO: Back button */}
      <View style={styles.iconContainer}>
        <Icon
          name="chevron-back-outline"
          size={35}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.chatboxContainer}>
          <Icon name="chatbubbles-outline" size={30} color="white" />
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.headerContainer}>
          <View style={styles.profilePictureContainer}>
            <Progress.Circle size={120} progress={border} borderWidth={0} animated={true} thickness={3} color={'red'} style={{position: 'absolute'}}/>
            <Image
              style={styles.profilePicture}
              source={{
                uri: 'https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg',
              }}
            />
          </View>
          <View style={styles.playerNameContainer}>
            <Text style={styles.playerFirstName} numberOfLines={1}>
              Kyrie
            </Text>
            <Text style={styles.playerLastName} numberOfLines={1}>
              Irving
            </Text>
          </View>
        </View>
        <View style={styles.verticalLine} />
        <View
          style={{
            marginTop: 60,
            marginLeft: 40,
            alignItems: 'center',
            height: 40,
          }}>
          <Text style={styles.playerNumber}>#11</Text>
        </View>
      </View>
      <View style={{ paddingTop: 30 }}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Team</Text>
          <View style={styles.slash} />
          <Text style={styles.playerInfo}>Brooklyn Nets</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Position</Text>
          <View style={styles.slash} />
          <Text style={styles.playerInfo}>Point Guard</Text>
        </View>
        {/* <Text>Contact Info</Text> */}
        <TouchableOpacity style={styles.categoryContainer} onPress={() => Linking.openURL('mailto:kyrieIrving@gmail.com')}>
          <Text style={styles.category}>Email</Text>
          <View style={styles.slash} />
          <Text style={styles.playerInfo}>kyrieIrving@gmail.com</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryContainer} onPress={() => call(phoneCallArgs).catch(console.error)}>
          <Text style={styles.category}>Phone</Text>
          <View style={styles.slash} />
          <Text style={styles.playerInfo}>(647)-222-1111</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // width: '100%',
    height: '100%',
    paddingTop: 50,
  },
  headerContainer: {
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  verticalLine: {
    width: 1,
    height: 100,
    backgroundColor: '#A9A9A9',
    marginTop: 40,
    marginLeft: 70,
  },
  iconContainer: {
    marginVertical: 10,
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  chatboxContainer: {
    height: 70,
    width: 70,
    backgroundColor: '#A9A9A9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
  },
  profilePicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  profilePictureContainer: {
    borderRadius: 60,
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
  },
  playerLastName: {
    fontSize: 40,
    color: '#A9A9A9',
  },
  playerInfo: {
    fontSize: 20,
    color: 'black',
  },
  playerNumber: {
    fontSize: 30,
    color: '#A9A9A9',
  },
  category: {
    fontSize: 20,
    color: '#A9A9A9',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 60,
    marginVertical: 5,
  },
  slash: {
    height: 30,
    width: 2,
    backgroundColor: '#A9A9A9',
    transform: [
      {
        rotate: '-30deg',
      },
    ],
  },
});

export default PlayerProfileScreen;
