import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import TeamScrollList from './TeamScrollList';
import PlayerListItem from './PlayerListItem'


const TeamAvailabilityPopup = props => {
  const { visible, players, onClose } = props;
  const theme = useSelector(state => state.theme.colors);
  const [playersGoing, setPlayersGoing] = useState([]);
  const [playersMaybe, setPlayersMaybe] = useState([]);
  const [playersUnavailable, setPlayersUnavailable] = useState([]);
  const [playersNoAnswer, setPlayersNoAnswer] = useState([]);

  useEffect(() => {
    let going = [], maybe = [], unavailable = [], noAnswer = [];
    if(players != null){
      for(let player of players){
        if(player.status === "going"){
          going.push(player);
        }else if(player.status === "maybe"){
          maybe.push(player);
        }else if(player.status === "unavailable"){
          unavailable.push(player);
        }else{
          noAnswer.push(player);
        }
      }
    }
    setPlayersGoing(going);
    setPlayersMaybe(maybe);
    setPlayersUnavailable(unavailable);
    setPlayersNoAnswer(noAnswer);
  }, [props])

  return (
    <SafeAreaView>
      <Modal 
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={{flexDirection: 'row', width: '100%', marginLeft: 20}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, color: 'black', fontFamily: 'Mark Pro Bold'}}>Availability</Text>
            </View>
            <View style={[styles.close,  {flex: 0.9}]}>
              <Icon name="close" color="black" size={30} onPress={onClose}/>
            </View>
          </View>
          <View>
            <View style={[styles.availabilityHeader, {backgroundColor: '#4ce660'}]}>
              <Icon name="checkmark" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Going</Text>
            </View>
            <View style={styles.subContainer}>
              {playersGoing.map((player, index) => (
                <PlayerListItem
                  key={player.id + index + 1}
                  player={player}
                  navigation={props.navigation}
                />
              ))}
              {playersGoing.length == 0 && 
                <View style={{margin: 10}}>
                  <Text>No players are going to this event.</Text>
                </View>
              }
            </View>
          </View>
          <View>
            <View style={[styles.availabilityHeader, {backgroundColor: '#a9a9a9'}]}>
              <Icon name="checkmark" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Maybe</Text>
            </View>
            <View style={styles.subContainer}>
              {playersMaybe.map((player, index) => (
                <PlayerListItem
                  key={player.id + index + 1}
                  player={player}
                  navigation={props.navigation}
                />
              ))}
              {playersMaybe.length == 0 && 
                <View style={{margin: 10}}>
                  <Text>No players are possibly going to this event.</Text>
                </View>
              }
            </View>
          </View>
          <View>
            <View style={[styles.availabilityHeader, {backgroundColor: '#e84343'}]}>
              <Icon name="checkmark" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Unavailable</Text>
            </View>
            <View style={styles.subContainer}>
              {playersUnavailable.map((player, index) => (
                <PlayerListItem
                  key={player.id + index + 1}
                  player={player}
                  navigation={props.navigation}
                />
              ))}
              {playersUnavailable.length == 0 && 
                <View style={{margin: 10}}>
                  <Text>No players are unavailable for this event.</Text>
                </View>
              }
            </View>
          </View>
          {/* <View style={{flexDirection: 'row', width: '100%', marginLeft: 20}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, color: 'white'}}>Availability</Text>
            </View>
            <View style={[styles.close,  {flex: 0.9}]}>
              <Icon name="close" color="white" size={30} onPress={onClose}/>
            </View>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#4ce660'}]}>
              <Icon name="checkmark" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Going</Text>
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#a9a9a9'}]}>
              <Icon name="help" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Maybe</Text>
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#e84343'}]}>
              <Icon name="close" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Unavailable</Text>
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#58a4db'}]}>
              <Icon name="cloudy-night" size={20} color='#1E2630' style={{padding: 5}}/>
              <Text style={styles.availabilityHeaderText}>Unavailable</Text>
            </View>
            <TeamScrollList players={players}/>
          </View> */}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    marginTop: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {

  },
  close: {
    alignItems: 'flex-end',
    padding: 20,
  },
  availabilityContainer: {
    padding: 10,
    flexDirection: 'row'
  },
  availabilityHeader: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20
  },
  availabilityHeaderText: {
    fontSize: 16,
    color: '#1E2630',
    padding: 5,
    paddingLeft: 0,
    fontFamily: 'Mark Pro'
  },
  subContainer: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TeamAvailabilityPopup;
