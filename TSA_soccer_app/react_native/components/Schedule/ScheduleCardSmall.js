import { ThemeProvider } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AvailabilityMenu from './AvailabilityMenu';
import { BlurView } from '@react-native-community/blur';
import Modal from 'react-native-modal';
import moment from 'moment';
import StatusIndicator from './StatusIndicator';
import TeamListPreview from './TeamListPreview';

const playersList = [
  {
    id: 0,
    name: 'Kyrie Irving',
    image:
      'https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg',
  },
  {
    id: 1,
    name: 'Fred Vanvleet',
    image:
      'https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTgwMzAwNzYzMjEyMjkzOTk2/usatsi_15834400_168390270_lowres-1.jpg',
  },
  {
    id: 2,
    name: 'Og Anunoby',
    image:
      'https://smartcdn.prod.postmedia.digital/torontosun/wp-content/uploads/2021/03/OGSUNS-scaled-e1616862876391.jpg?quality=100&strip=all',
  },
  {
    id: 3,
    name: 'Kyle Lowry',
    image:
      'https://www.si.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTY4MDA3MjExNzU3Njc1Nzkz/kyle_lowry_raptors_parade_jpg.jpg',
  },
  {
    id: 4,
    name: 'Kawhi Leonard',
    image: 'https://pbs.twimg.com/media/Dn3eeqBU0AI80LY.jpg',
    last: true,
  },
];

const ScheduleCardSmall = props => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const { onPress, event, cancelled } = props;
  const theme = useSelector(state => state.theme.colors);
  const smallCard = useRef();
  const [openAvailableMenu, setOpenAvailableMenu] = useState(false);
  const defaultOption = {
    label: 'Set Availability',
    icon: 'information-outline',
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

  const onSelectOptionHandler = option => {
    setOpenAvailableMenu(false);
    setAvailability(option);
    props.setShowAddButton(true);
  };

  const openMenu = () => {
    if (!cancelled) {
      smallCard.current.measure((fx, fy, width, height, px, py) => {
        console.log(px);
        setOffsetX(px);
        setOffsetY(py + 20);
        if (px > 10 && px <= 240) {
          setOpenAvailableMenu(true);
          if (px > 200) {
            props.setShowAddButton(false);
          }
        }
      });
    }
  };

  return (
    <TouchableOpacity
      ref={smallCard}
      onPress={onPress}
      style={[styles.touchableContainer, { backgroundColor: theme.cardBg }]}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <View>
          <Text style={styles.monday}>May</Text>
          <Text style={styles.date}>24</Text>
        </View>
        <StatusIndicator
          label={availability.label}
          icon={availability.icon}
          color={availability.color}
          onPress={() => openMenu()}
          type="small"
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.type}>Practice</Text>
      </View>
      <View style={styles.infoHeaderContainer}>
        <Text style={styles.time}>5:30 - 6:30 pm</Text>
      </View>
      <TeamListPreview
        players={playersList}
        size={35}
        max={3}
      />
      {/* {cancelled ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            height: 40,
            marginLeft: 18,
          }}>
          <Text style={{ color: 'red', fontSize: 18, fontWeight: '500' }}>
            Cancelled
          </Text>
        </View>
      ) : null} */}
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
            onBackdropPress={() => {
              setOpenAvailableMenu(false);
              props.setShowAddButton(true);
            }}
            style={{ position: 'absolute', top: offsetY, left: offsetX }}>
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
                        width: 90,
                        height: 40,
                      },
                      option.label === 'Going'
                        ? {
                            borderTopRightRadius: 10,
                            borderTopLeftRadius: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: 'white',
                          }
                        : null,
                      option.label === 'Unavailable'
                        ? {
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            borderTopWidth: 1,
                            borderTopColor: 'white',
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
          </Modal>
        </BlurView>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    height: 230,
    width: 160,
    borderRadius: 10,
    elevation: 4,
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 1 },
    zIndex: 100,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    width: '100%',
    marginTop: 6,
  },
  month: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
  },
  date: {
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
  },
  time: {
    fontFamily: 'Roboto-Light',
    fontSize: 13,
  },
  type: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
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
    paddingTop: 0,
  },
  availableIcon: {
    width: '100%',
    flexDirection: 'row',
  },
  infoHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    marginBottom: 12,
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
    paddingLeft: 20,
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
    fontSize: 16,
  },
  bottomHighlight: {
    backgroundColor: 'grey',
    height: 40,
    width: 80,
    borderRadius: 20,
  },
});

export default ScheduleCardSmall;
