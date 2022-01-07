import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const TeamListItem = props => {
  const { team, currentTeam, selectTeam } = props;
  const theme = useSelector(state => state.theme.colors);
console.log("Joell currentTeam", currentTeam);
  return (
    <TouchableOpacity
      onPress={() => selectTeam(team)}
      style={styles.touchableContainer}>
      <View
        style={[styles.container, currentTeam.name === team.name ? {backgroundColor: 'lightgrey'} : {backgroundColor: theme.secondaryBg}]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.text, {color: theme.primaryText, fontFamily: 'Mark Pro'}]}>{team.name}</Text>
        </View>
        {currentTeam.name === team.name ?
        <Icon color="#A9A9A9" size={20} name="checkmark-outline" />
        :
        null
        }
      </View>
    </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TeamListItem;
