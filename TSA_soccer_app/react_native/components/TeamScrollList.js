import React from 'react';
import { Text, StyleSheet, View, Image, ScrollView } from 'react-native';

const TeamScrollList = props => {

  const { players } = props

  return (
    <View
      style={styles.container}
    >
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {players.map((player, index) => (
          <View
            style={styles.innerContainer}
          >
            <Image 
              style={styles.logo}
              source={{ uri: player.image}}
            />
            <Text
              numberOfLines={2}
              style={styles.text}
            >{player.name}</Text>
          </View>
        ))}
        {players.map((player, index) => (
          <View
            style={styles.innerContainer}
          >
            <Image 
              style={styles.logo}
              source={{ uri: player.image}}
            />
            <Text
              numberOfLines={2}
              style={styles.text}
            >{player.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 80,
      backgroundColor: 'white', 
      borderBottomColor: '#C0C0C0',
      borderBottomWidth: 0.5
    },
    innerContainer: {
      width: 60,
      height: 100,
      position: 'relative',
      alignItems: 'center'
    },
    logo: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 5,
      marginBottom: 5
    },
    text: {
      width: 40,
      fontSize: 10,
      fontWeight: '500',
      textAlign: 'center',
      overflow: 'hidden'
    }
});

export default TeamScrollList;
