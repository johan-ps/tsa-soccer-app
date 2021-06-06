import { ThemeProvider } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, Image, Animated, Easing, Pressable, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';

const PlayerListItem = props => {

  const { player, navigation } = props
  const theme = useSelector(state => state.theme.colors);

  return (
    <View>
      <TouchableHighlight
        onPress={() => navigation.navigate('PlayerProfile')}
        style={{width: '100%'}}
      >
        <View
          style={[styles.container, player.last ? {borderBottomWidth: 0} : null]}
        >
          <Image 
            style={styles.logo}
            source={{ uri: player.image}}
          />
          <Text
            style={styles.text}
          >{player.name}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
  
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 60,
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      alignItems: 'center',
      backgroundColor: 'white', 
      borderBottomColor: '#C0C0C0',
      borderBottomWidth: 0.5
    },
    logo: {
      height: 40,
      width: 40,
      borderRadius: 25,
      marginTop: 20,
      marginBottom: 20,
      marginRight: 20
    },
    text: {
      fontSize: 16,
      fontWeight: '500'
    }
});

export default PlayerListItem;
