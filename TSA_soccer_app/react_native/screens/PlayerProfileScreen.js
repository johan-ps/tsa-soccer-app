import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'

const PlayerProfileScreen = ({ navigation }) => {

  const theme = useSelector(state => state.theme.colors);

  // TODO: add name, team, number, position, contact info (email, number)

  return (
    <View style={styles.container}>
       {/* TODO: Back button */}
      <View style={styles.iconContainer}>
        <Icon 
          name="chevron-back-outline" 
          size={30} 
          onPress={() => navigation.goBack()}> 
        </Icon>
        <Icon 
          name="chatbox" 
          size={30} 
          color='grey' 
          style={{right:-260, top:5}}
        >  
        </Icon>
      </View>
      {/* <View style={styles.parallelogram}>
        <TriangleUp style={styles.parallelogramRight} />
        <View style={styles.parallelogramInner} />
        <TriangleDown style={styles.parallelogramLeft} />
      </View> */}
      <View style={{ flexDirection: 'row'}}>
        <View style={styles.headerContainer}>
          <View style={styles.profilePictureContainer}>
            <Image 
              style={styles.profilePicture}
              source={{ uri: "https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg" }}
            />
          </View>
          <View style={styles.playerNameContainer}>
            <Text style={styles.playerFirstName} numberOfLines={1}>Kyrie</Text>
            <Text style={styles.playerLastName} numberOfLines={1}>Irving</Text>
          </View>
        </View>
        <View style={styles.verticalLine} />
        <View style={{ marginTop: 60, marginLeft: 40, alignItems:'center', height: 40}}>
          <Text style={styles.playerNumber}>#11</Text>
        </View>
      </View>
      <View style={{ paddingTop: 30}}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Team</Text>
          <Text style={styles.playerInfo}>Brooklyn Nets</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Position</Text>
          <Text style={styles.playerInfo}>Point Guard</Text>
        </View>
      {/* <Text>Contact Info</Text> */}
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Email</Text>
          <Text style={styles.playerInfo}>kyrieIrving@gmail.com</Text>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>Phone</Text>
          <Text style={styles.playerInfo}>(647)-222-1111</Text>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: 50
  },
  headerContainer:{
    left: 20,
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'column',
  },
  verticalLine: {
    width: 1,
    height: 100,
    backgroundColor: '#A9A9A9',
    marginTop: 40,
    marginLeft: 70
  },
  iconContainer: {
    margin: 20,
    width: 30,
    flexDirection: 'row'
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
    flexDirection:'column',
    width: '100%',
    left: 50
  },
  playerFirstName: {
    fontSize: 40,
    fontWeight: '600'
  },
  playerLastName: {
    fontSize: 40,
    color: '#A9A9A9'
  },
  playerInfo: {
    fontSize: 20,
    color: 'black',
    paddingTop: 10,
    paddingLeft: 5
  },
  playerNumber: {
    fontSize: 30,
    color: '#A9A9A9'
  },
  category: {
    fontSize: 15,
    color: '#A9A9A9',
    backgroundColor: '#E8E8E8'
  },
  categoryContainer: {
    flexDirection:'column',
    padding: 10,
    paddingBottom: 0
  },
  parallelogram: {
    width: 150,
    height: 100,
  },
  parallelogramInner: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "red",
    width: 150,
    height: 100,
  },
  parallelogramRight: {
    top: 0,
    right: -50,
    position: "absolute",
  },
  parallelogramLeft: {
    top: 0,
    left: -50,
    position: "absolute",
  },
});

export default PlayerProfileScreen;
