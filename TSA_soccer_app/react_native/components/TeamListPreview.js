import React from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';

const TeamListPreview = props => {
  const { players, onPlusPress } = props;

  return (
    <View style={styles.container}>
        {players.map((player, index) => (
          <View style={[styles.innerContainer, {position: 'absolute', left: index*33}]} key={player.id}>
            <Image style={styles.logo} source={{ uri: player.image }} />
          </View>
        ))}
        <TouchableHighlight onPress={() => onPlusPress()}>
          <View style={[styles.innerContainer, {position: 'absolute', left: players.length*33}]}>
            <Image style={[styles.logo, {backgroundColor: '#A9A9A9'}]} source={{ uri: "https://uxwing.com/wp-content/themes/uxwing/download/01-user_interface/plus-square.png" }} />
          </View>
        </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 43,
    width: 43,
    borderRadius: 21.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
    borderColor: '#A9A9A9',
    borderWidth: 1
  },
});

export default TeamListPreview;
