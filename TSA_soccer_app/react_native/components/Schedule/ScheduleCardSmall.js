import { ThemeProvider } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, TouchableHighlight, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AvailabilityMenu from './AvailabilityMenu';
import { BlurView } from "@react-native-community/blur";
import Modal from 'react-native-modal';

const ScheduleCardSmall = props => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const { onPress } = props;
  const theme = useSelector(state => state.theme.colors);
  const smallCard = useRef();
  const [openAvailableMenu, setOpenAvailableMenu] = useState(false);
  const defaultOption = {icon: 'information-outline', color: '#1E2630'};
  const options = [{id: 0, label: 'Going', icon: 'checkmark', color: '#4ce660'}, {id: 1, label: 'Maybe', icon: 'help',  color: '#a9a9a9'}, {id: 2, label: 'Unavailable', icon: 'close', color: '#e84343'}];
  const [availability, setAvailability] = useState(defaultOption);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);


  const onSelectOptionHandler = option => {
    setOpenAvailableMenu(false);
    setAvailability(option);
    props.setShowAddButton(true);
  };

  const openMenu = () => {
    smallCard.current.measure((fx, fy, width, height, px, py) => {
      console.log(px);
      setOffsetX(px);
      setOffsetY(py+20);
      if(px > 10 && px <= 240){
        setOpenAvailableMenu(true);
        if(px > 200){
          props.setShowAddButton(false);
        }
      }
    });
  }

  return (
    <TouchableOpacity
      ref={smallCard}
      onPress={onPress}
      style={[styles.touchableContainer, { backgroundColor: theme.primaryBg }]}
      underlayColor="#DDDDDD">
      <View style={{position: 'relative'}}>
        <View style={styles.container}>
          <View style={styles.availableIcon}>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-start', width: 60}}>
              <Text style={styles.infoTextTop} numberOfLines={1}>15 May</Text>
              <Text style={styles.infoTextBottom} numberOfLines={1}>Wed</Text>
            </View>
            <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
              <AvailabilityMenu option={availability} onPress={() => openMenu()}/>
            </View>
          </View>
          
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <View style={styles.infoHeaderContainer}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="time-outline" size={20} color="black" />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.infoTextTop}>5:30 pm</Text>
                <Text style={styles.infoTextBottom}>- 6:30 pm</Text>
              </View>
            </View> */}
            {/* <View style={{flexDirection: 'row'}}>
              <View style={{ paddingRight: 10 }}>
                <Icon name="location-outline" size={20} color="black" />
              </View>
              <View style={{ width: 80 }}>
                <Text style={styles.infoTextTop} >ScotiaBank Arena</Text>
              </View>
            </View> */}
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={styles.text}>Game</Text>
            <Text numberOfLines={1} style={styles.versus}>vs. MUMBA</Text>
          </View>
        </View>
                  {/* <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
                    <View>
              <Image style={{height: 50, width: 100}} source={{uri: 'https://spng.pngfind.com/pngs/s/582-5824763_circle-shadow-png-monochrome-transparent-png.png'}}/>
            </View> */}
        {/* <View style={styles.bottomHighlight}/> */}
        {openAvailableMenu ? 
        <BlurView 
          style={styles.absolute}
          blurType="xlight"
          blurAmount={1}
          reducedTransparencyFallbackColor="white"
        >
          <Modal 
            animationIn={'fadeIn'} 
            animationOut={'fadeOut'}
            isVisible={openAvailableMenu} 
            backdropColor={'rgba(0,0,0,0)'} 
            onBackdropPress={() => {setOpenAvailableMenu(false); props.setShowAddButton(true);}}
            style={{position: 'absolute', top: offsetY, left: offsetX }}
          >
            {options.map(option => {
              return (
                <View key={option.id}>
                  <TouchableHighlight
                    onPress={() => {
                      onSelectOptionHandler(option);
                    }}
                    style={[{backgroundColor: '#A9A9A9', justifyContent: 'center', alignItems: 'center', width: 90, height: 40},
                            option.label === 'Going' ? {borderTopRightRadius: 10, borderTopLeftRadius: 10, borderBottomWidth: 1, borderBottomColor: 'white'} : null,
                            option.label === 'Unavailable' ? {borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderTopWidth: 1, borderTopColor: 'white'} : null
                      ]} 
                    underlayColor={option.color}
                    >
                    <View
                      style={[
                        styles.textWrapper]}>
                      <Text style={[styles.label, { color: theme.menuText }]}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              );
            })}
          </Modal>
        </BlurView>
        :
        null
      }
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 180,
    width: 130,
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'column',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 22,
    textAlign: 'left',
    paddingLeft: 20,
    paddingTop: 0
  },
  availableIcon: {
    width: '100%',
    width: 35,
    height: 35,
    margin: 20,
    flexDirection: 'row'
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingRight: 10,
    width: 150,
  },
  infoTextTop: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    color: 'black',
  },
  infoTextBottom: {
    fontSize: 12,
    color: '#ebe8e8',
    textAlign: 'left',
    color: 'black',
  },
  versus: {
    fontSize: 12,
    paddingLeft: 20
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    width: 130,
    borderRadius: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: 16
  },
  bottomHighlight: {
    backgroundColor: 'grey', 
    height: 40,
    width: 80,
    borderRadius: 20
  }
});

export default ScheduleCardSmall;
