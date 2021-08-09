import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ScheduleClock from './ScheduleClock';
import AvailabilityMenu from './AvailabilityMenu';
import { BlurView } from '@react-native-community/blur';
import Modal from 'react-native-modal';
import StatusIndicator from './StatusIndicator';

const ScheduleCard = props => {
  const { onPress, item } = props;
  const [openAvailableMenu, setOpenAvailableMenu] = useState(false);
  const bigCard = useRef();
  const theme = useSelector(state => state.theme.colors);
  const defaultOption = {
    label: 'Set Availability',
    color: '#1E2630',
  };
  const options = [
    { id: 0, label: 'Going', icon: 'checkmark-done', color: '#4ce660' },
    { id: 1, label: 'Maybe', icon: 'help', color: '#a9a9a9' },
    { id: 2, label: 'Unavailable', icon: 'close', color: '#e84343' },
  ];
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
      setOffsetY(py + 40);
    });
    setOpenAvailableMenu(true);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      ref={bigCard}
      style={[
        styles.touchableContainer,
        { backgroundColor: 'white', width: width - 40 },
      ]}
      activeOpacity={0.8}>
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ScheduleClock startTime={item.startTime} endTime={item.endTime} />
        </View>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'flex-end',
              width: '100%',
              height: '100%',
            }}>
            <StatusIndicator
              label={availability.label}
              icon={availability.icon}
              color={availability.color}
              onPress={() => openMenu()}
            />
            <StatusIndicator label="Practice" color="#1e79e3" />
            <StatusIndicator
              label="Scotiabank Arena"
              icon="location-outline"
              color="#1e79e3"
            />
            {/* <View style={styles.availableIcon}>
              <AvailabilityMenu
                option={availability}
                onPress={() => openMenu()}
              />
            </View> */}
            {/* <View
              style={{
                flexDirection: 'column',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                <View style={{ paddingRight: 0 }}>
                  <Icon name="location-outline" size={20} color="black" />
                </View>
                <View style={{ paddingRight: 0 }}>
                  <Text style={styles.infoTextTop}>{item.location}</Text>
                </View>
              </View>
              <Text style={styles.text}>
                {item.type === 'Other' ? item.title : item.type}
              </Text>
            </View> */}
          </View>
        </View>
      </View>
      {openAvailableMenu ? (
        <BlurView
          style={styles.absolute}
          blurType="xlight"
          blurAmount={1}
          reducedTransparencyFallbackColor="white">
          <Modal
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            isVisible={openAvailableMenu}
            backdropColor={'rgba(0,0,0,0)'}
            onBackdropPress={() => setOpenAvailableMenu(false)}
            style={{ position: 'absolute', top: offsetY, left: offsetX }}>
            <View style={{ flexDirection: 'row' }}>
              {options.map(option => {
                return (
                  <View key={option.id}>
                    <TouchableHighlight
                      onPress={() => {
                        onSelectOptionHandler(option);
                      }}
                      style={[
                        {
                          backgroundColor: '#A9A9A9',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: 100,
                          height: 40,
                        },
                        option.label === 'Going'
                          ? {
                              borderBottomLeftRadius: 10,
                              borderTopLeftRadius: 10,
                              borderRightWidth: 1,
                              borderRightColor: 'white',
                            }
                          : null,
                        option.label === 'Unavailable'
                          ? {
                              borderBottomRightRadius: 10,
                              borderTopRightRadius: 10,
                              borderLeftWidth: 1,
                              borderLeftColor: 'white',
                            }
                          : null,
                      ]}
                      underlayColor={option.color}>
                      <View style={[styles.textWrapper]}>
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
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 200,
    borderRadius: 10,
    elevation: 4,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 1 },
    zIndex: 100,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  container: {
    flexDirection: 'column',
    width: '52%',
  },
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 25,
    textAlign: 'left',
    marginBottom: 5,
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
    fontSize: 16,
  },
});

export default ScheduleCard;
