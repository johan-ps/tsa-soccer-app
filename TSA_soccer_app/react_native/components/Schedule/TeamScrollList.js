import React from 'react';
import { Text, StyleSheet, View, Image, ScrollView } from 'react-native';

const TeamScrollList = props => {
  const { players } = props;

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {players.map((player, index) => (
          <View style={styles.innerContainer} key={player.id}>
            <Image style={styles.logo} source={{ uri: player.image }} />
            <Text numberOfLines={2} style={styles.text}>
              {player.name}
            </Text>
          </View>
        ))}
        {players.map((player, index) => (
          <View style={styles.innerContainer} key={player.id + index + 1}>
            <Image style={styles.logo} source={{ uri: player.image }} />
            <Text numberOfLines={2} style={styles.text}>
              {player.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#1E2630',
  },
  innerContainer: {
    width: 60,
    position: 'relative',
    alignItems: 'center',
  },
  logo: {
    height: 45,
    width: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    width: 50,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    overflow: 'hidden',
    color: 'white'
  },
});

export default TeamScrollList;
