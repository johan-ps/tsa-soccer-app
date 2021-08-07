import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TouchableHighlight, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScheduleClock from './ScheduleClock';
import AvailabilityMenu from './AvailabilityMenu';
import { BlurView } from "@react-native-community/blur";
import Modal from 'react-native-modal';

const ScheduleCard = props => {
  const { onPress, item } = props;
  const [openAvailableMenu, setOpenAvailableMenu] = useState(false);
  const bigCard = useRef();
  const theme = useSelector(state => state.theme.colors);
  const defaultOption = {icon: 'information-outline', color: '#1E2630'};
  const options = [{id: 0, label: 'Going', icon: 'checkmark', color: '#4ce660'}, {id: 1, label: 'Maybe', icon: 'help',  color: '#a9a9a9'}, {id: 2, label: 'Unavailable', icon: 'close', color: '#e84343'}];
  const [availability, setAvailability] = useState(defaultOption);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const { width } = useWindowDimensions();

  const onSelectOptionHandler = option => {
    setOpenAvailableMenu(false);
    setAvailability(option);
  };

  const openMenu = () => {
    bigCard.current.measure((fx, fy, width, height, px, py) => {
      setOffsetX(px);
      setOffsetY(py+40);
    });
    setOpenAvailableMenu(true);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      ref={bigCard}
      style={[styles.touchableContainer, {backgroundColor: theme.primaryBg, width: width - 40}]}
      underlayColor="#DDDDDD" >
      <View style={{flexDirection: 'row', height: 180}}>
        <View style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <ScheduleClock startTime={item.startTime} endTime={item.endTime}/>
        </View>
        <View style={styles.container}>
          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%'}}>
            <View style={styles.availableIcon}>
              <AvailabilityMenu option={availability} onPress={() => openMenu()}/>
            </View>
            <View style={{ flexDirection: 'column', height: '50%', width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 10}}>
                <View style={{ paddingRight: 5 }}>
                  <Icon name="location-outline" size={20} color="black" />
                </View>
                <View style={{ paddingRight: 10 }}>
                  <Text style={styles.infoTextTop} >{item.location}</Text>
                </View>
              </View>
              <Text style={styles.text}>{item.type === 'Other' ? item.title : item.type}</Text>
            </View>
          </View>
        </View>
      </View>
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
            onBackdropPress={() => setOpenAvailableMenu(false)}
            style={{position: 'absolute', top: offsetY, left: offsetX }}
          >
            <View style={{flexDirection: 'row'}}>
            {options.map(option => {
              return (
                <View key={option.id}>
                  <TouchableHighlight
                    onPress={() => {
                      onSelectOptionHandler(option);
                    }}
                    style={[{backgroundColor: '#A9A9A9', justifyContent: 'center', alignItems: 'center', width: 100, height: 40},
                            option.label === 'Going' ? {borderBottomLeftRadius: 10, borderTopLeftRadius: 10, borderRightWidth: 1, borderRightColor: 'white'} : null,
                            option.label === 'Unavailable' ? {borderBottomRightRadius: 10, borderTopRightRadius: 10, borderLeftWidth: 1, borderLeftColor: 'white'} : null
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
            </View>
          </Modal>
        </BlurView>
        :
        null
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 180,
    borderRadius: 10,
    backgroundColor: '#1E2630',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '52%'
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 25,
    textAlign: 'left',
    marginBottom: 5
  },
  availableIcon: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  infoContainer: {
    flexDirection: 'row',
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
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    width: '100%',
    borderRadius: 10,
  },
  label: {
    fontWeight: '500',
    fontSize: 16
  }
});

export default ScheduleCard;
