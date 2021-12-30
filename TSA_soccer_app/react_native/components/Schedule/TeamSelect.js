import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableHighlight, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const TeamSelect = props => {
  const { currentTeam, teams, reloadEvents } = props;
  const [showTeams, setShowTeams] = useState(false);
  const [selected, setSelected] = useState(currentTeam);
  const theme = useSelector(state => state.theme.colors);

  const onClickHandler = () => {
    setShowTeams(!showTeams);
  }

  const onSelectHandler = (teamId, teamName) => {
    setSelected(teamName);
    reloadEvents(teamId);
  }

  return (
    <View style={styles.container}>
    <TouchableOpacity 
      onPress={onClickHandler}
    >
      <View style={styles.currentTeam}>
        <Text style={[
          styles.team,
          { color: theme.primaryText, fontFamily: theme.fontRegular },
        ]}>
          {selected}
        </Text>
        <Icon name="chevron-forward-outline" size={20} color={theme.primaryText} style={{marginTop:22}}/>
      </View>
    </TouchableOpacity>
    <SafeAreaView>
      <Modal 
      visible={showTeams}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide"
      >
        <View style={[styles.modalContainer, {backgroundColor: theme.secondaryBg}]}>
          <View style={{flexDirection: 'row', width: '100%', marginLeft: 20}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, color: 'black', fontFamily: 'Mark Pro Bold'}}>Select Team</Text>
            </View>
            <View style={[styles.close,  {flex: 0.9}]}>
              <Icon name="close" color="black" size={30} onPress={onClickHandler}/>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    marginTop: 325,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  currentTeam: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  team: {
    fontSize: 18,
    ...Platform.select({
      ios: {
        marginTop: 20,
      },
    })
  },
  close: {
    alignItems: 'flex-end',
    padding: 20,
  },
});

export default TeamSelect;
