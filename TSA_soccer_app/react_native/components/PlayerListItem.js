import { ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import { useSelector } from 'react-redux';

const PlayerListItem = props => {
  const { player, navigation } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <TouchableHighlight
      onPress={() => navigation.navigate('PlayerProfile')}
      style={styles.touchableContainer}>
      <View
        style={[styles.container, player.last ? { borderBottomWidth: 0 } : {}]}>
        <Image style={styles.logo} source={{ uri: player.image }} />
        <Text style={styles.text}>{player.name}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 0.2,
    borderStyle: 'solid',
    padding: 10,
    paddingHorizontal: 15,
  },
  logo: {
    height: 40,
    width: 40,
    borderRadius: 25,
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PlayerListItem;
