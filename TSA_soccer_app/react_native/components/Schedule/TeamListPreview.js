import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TeamListPreview = props => {
  const { players, onPlusPress, size = 43, max = 1 } = props;

  return (
    <View style={styles.container}>
      {players && players.slice(0, max || players.length).map((player, index) => (
        <View
          style={[
            styles.innerContainer,
            { position: 'absolute', left: index * size * 0.7 },
          ]}
          key={player.id}>
          <Image
            style={[styles.logo, size ? { width: size, height: size } : {}]}
            source={{ uri: player.profileImg }}
          />
        </View>
      ))}
      {players.length > 0 ?
      <TouchableHighlight
        style={{
          position: 'absolute',
          left: players.slice(0, max || players.length).length * size * 0.7,
          borderRadius: 50
        }}
        onPress={() => onPlusPress ? onPlusPress() : null}>
        <View style={[styles.more, size ? { width: size, height: size } : {}]}>
          <Text style={styles.moreText}>{players.length - max > 0 ? players.length - max : ""}+</Text>
        </View>
      </TouchableHighlight>
      : 
      null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerContainer: {
    alignItems: 'center',
  },
  more: {
    // borderColor: 'black',
    // borderWidth: 1,
    // borderStyle: 'solid',
    elevation: 4,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 1 },
    zIndex: 100,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  moreText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: 'grey',
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
    borderWidth: 1,
  },
});

export default TeamListPreview;
