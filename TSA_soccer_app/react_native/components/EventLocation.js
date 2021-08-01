import { ThemeProvider } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Modal, TouchableOpacity, Image, Animated, } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AvailabilityMenu from './AvailabilityMenu';
import MapView, { Marker } from 'react-native-maps';
import UiInput from './UiInput';

const EventLocation = props => {
  const { onPress, showLocation, closeLocation, onSelect } = props;
  const theme = useSelector(state => state.theme.colors);
  const [edit, setEdit] = useState(false);

  const [region, setRegion] = useState({
    latitude: 43.64360582926461,
    longitude: -79.3791203596054,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [marker, setMarker] = useState({
    title: 'ScotiaBank Arena',
    description: 'Toronto Raptors',
    latlng: {
      latitude: 43.64360582926461,
      longitude: -79.3791203596054,
    },
  });

  return (
    <SafeAreaView>
    <Modal visible={showLocation}
    transparent={true}
    statusBarTranslucent={true}
    animationType="slide">
      <View style={[styles.modalContainer]}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => closeLocation()} style={{alignItems: 'flex-start', width: '25%', padding: 12}}>
          <Text style={styles.headingText}>Cancel</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', width: '50%', padding: 10}}>
          <Text style={[styles.headingText, {fontSize: 20}]} numberOfLines={1}>Select Location</Text>
          </View>
          <TouchableOpacity onPress={() => setEdit(!edit)} style={{alignItems: 'flex-end', width: '25%', padding: 12}}>
          <Text style={styles.headingText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.locationContainer}>
          <Text style={styles.locationText}>New Location</Text>
          <View style={{width: '60%', alignItems: 'flex-end'}}>
            <View style={styles.addContainer}>
              <Icon name="add" size={40} color={'red'}/>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationContainer} onPress={() => {onSelect('Scotiabank Arena'); closeLocation();}}>
          <View>
            <Text style={{color: 'black', fontSize: 18, fontWeight: '500'}}>Scotiabank Arena</Text>
            <Text>40 Bay St.</Text>
            <Text>Toronto, ON</Text>
            <Text>L6E 1P6</Text>
          </View>
          <View style={{width: '60%', alignItems: 'flex-end'}}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                loadingEnabled={true}
                pitchEnabled
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
                loadingBackgroundColor="black"
                userInterfaceStyle="dark"
                mapPadding={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <Marker
                    key={1}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}>
                      <Image
                          source={{
                            uri: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
                          }}
                          style={{ height: 35, width: 35 }}
                        />
                    </Marker>
              </MapView>
            </View>
          </View>
          {/* {edit ? 
            <View style={{backgroundColor: 'red', width: 100, height: '100%'}}>
              <Icon name="trash-outline"/>
            </View>
            :
            null
          } */}
        </TouchableOpacity>
      </View>
    </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    marginTop: 50,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'white'
  },
  headingText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '600'
  },
  locationText: {
    fontSize: 18,
    color: 'red'
  },
  mapContainer: {
    height: 100,
    width: 100,
    margin: 20,
    marginLeft: 40,
    marginRight: 40,
  },
  addContainer: {
    height: 100,
    width: 100,
    borderRadius: 20,
    backgroundColor: 'rgba(252, 3, 3, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  locationContainer: {
    width: '100%', 
    height: 120, 
    borderBottomWidth: 1, 
    borderBottomColor: '#C0C0C0', 
    marginLeft: 20, 
    alignItems: 'center', 
    flexDirection: 'row'
  }
});

export default EventLocation;
