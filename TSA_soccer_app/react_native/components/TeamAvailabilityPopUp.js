import React from 'react';
import { Text, StyleSheet, View, Image, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import TeamScrollList from './TeamScrollList';


const TeamAvailabilityPopup = props => {
  const { visible, players, onClose } = props;
  const theme = useSelector(state => state.theme.colors);
  

  return (
    <SafeAreaView>
      <Modal 
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      animationType="slide"
      >
        <View style={styles.modalContainer}>
          {/* <View style={{flexDirection: 'row', width: '100%'}}> */}
            <View style={styles.close}>
              <Icon name="close" color="white" size={30} onPress={onClose}/>
            </View>
          {/* </View> */}
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#4ce660'}]}>
              <Icon name="checkmark" size={20} color='#1E2630' style={{padding: 5}}/>
              {/* <Text style={styles.availabilityHeaderText}>Going</Text> */}
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#a9a9a9'}]}>
              <Icon name="help" size={20} color='#1E2630' style={{padding: 5}}/>
              {/* <Text style={styles.availabilityHeaderText}>Maybe</Text> */}
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#e84343'}]}>
              <Icon name="close" size={20} color='#1E2630' style={{padding: 5}}/>
              {/* <Text style={styles.availabilityHeaderText}>Unavailable</Text> */}
            </View>
            <TeamScrollList players={players}/>
          </View>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityHeader, {backgroundColor: '#58a4db'}]}>
              <Icon name="cloudy-night" size={20} color='#1E2630' style={{padding: 5}}/>
              {/* <Text style={styles.availabilityHeaderText}>Unavailable</Text> */}
            </View>
            <TeamScrollList players={players}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E2630',
    marginTop: 200,
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  availabilityHeaderText: {
    fontSize: 16,
    color: '#1E2630',
    padding: 5,
    paddingLeft: 0
  }
});

export default TeamAvailabilityPopup;
