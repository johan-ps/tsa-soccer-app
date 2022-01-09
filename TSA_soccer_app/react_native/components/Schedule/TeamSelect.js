import React, { useState, useCallback, useEffect } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableHighlight, Modal } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import TeamListItem from './TeamListItem';
import { formatTeams } from '../../Util/utilities';
import * as teamActions from '../../store/actions/TeamActions'

const TeamSelect = props => {
  const { current, onSelect, title } = props;
  const [showTeams, setShowTeams] = useState(false);
  const theme = useSelector(state => state.theme.colors);
  const dispatch = useDispatch();
  const unformattedTeams = useSelector(state => state.teams);
  const formattedTeams = unformattedTeams && formatTeams(unformattedTeams);

  const onClickHandler = () => {
    setShowTeams(!showTeams);
  }

  const loadTeams = useCallback(async () => {
    try {
      await dispatch(teamActions.getTeams());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const onSelectHandler = (team) => {
    onClickHandler();
    onSelect(team);
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
          {current && current.name}
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
              <Text style={{fontSize: 20, color: 'black', fontFamily: 'Mark Pro Bold'}}>{title}</Text>
            </View>
            <View style={[styles.close,  {flex: 0.9}]}>
              <Icon name="close" color="black" size={30} onPress={onClickHandler}/>
            </View>
          </View>
          {formattedTeams.length !== 0 && formattedTeams.map((teams) => 
            <View>
              {teams.label ?
                <View style={{margin: 10}}>
                  <Text style={{fontSize: 16, color: 'grey', fontFamily: 'Mark Pro'}}>{teams.label}</Text>
                </View>
                :
                null
              }
              {/* <View style={styles.subContainer}>
                {teams.children.map((team, index) => (
                  <TeamListItem
                    key={team.id + index + 1}
                    team={team}
                    selectTeam={(selectedTeam) => onSelectHandler(selectedTeam)}
                    currentTeam={current}
                  />
                ))}
              </View> */}
            </View>
          )
          }
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
