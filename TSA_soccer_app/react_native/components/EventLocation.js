import { ThemeProvider } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Modal, TouchableOpacity, Image, Animated, ScrollView, } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import AvailabilityMenu from './AvailabilityMenu';
import MapView, { Marker } from 'react-native-maps';
import UiInput from './UiInput';
import { Easing } from 'react-native-reanimated';

const EventLocation = props => {
  const { showLocation, closeLocation, onSelect } = props;
  const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
  const theme = useSelector(state => state.theme.colors);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState('')
  const [newLocation, setNewLocation] = useState(false)
  const [preExistingLocations, setPreExistingLocations] = useState([{name: 'Scotiabank Arena', street: '40 Bay St.', city: 'Toronto, ON', postalCode: 'L6E 1P6'}])
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);


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

  const searchPlaces = async (aSearchString) => {
    setSearch(aSearchString);
    if (aSearchString.trim() === '') return
    const location = '43.651890,-79.381706';
    const radius = 500000;
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json?key=AIzaSyB-HOOioh0lR-hXaggyEzYXVFKdylnbpFk&libraries=places&input=${encodeURIComponent(aSearchString)}&location=${encodeURIComponent(location)}&radius=${encodeURIComponent(radius)}`
    fetch(apiUrl).then((response) => response.json())
    .then((result) => {
      if(result.status === 'OK'){
        const { predictions } = result;
        setLocationOptions(predictions);
      }
      else if(result.status === 'ZERO_RESULTS'){
        setLocationOptions([]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const onSelectLocation = (placeId) => {
    if (placeId.trim() === '') return
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/details/json?key=AIzaSyB-HOOioh0lR-hXaggyEzYXVFKdylnbpFk&libraries=places&place_id=${encodeURIComponent(placeId)}`;
    fetch(apiUrl).then((response) => response.json())
    .then((data) => {
      setSelectedLocation(data.result)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const saveLocation = () => {
    let x = [...preExistingLocations];
    x.push({name: selectedLocation.name, street: selectedLocation.address_components[1].long_name + selectedLocation.address_components[2].long_name, city: selectedLocation.address_components[3].long_name+', ' + selectedLocation.address_components[4].short_name, postalCode: selectedLocation.address_components[selectedLocation.address_components.length-1].long_name});
    setPreExistingLocations(x)
    closeLocation();
    setNewLocation(false);
    setSelectedLocation(null);
    onSelect(selectedLocation.name)
  }

  return (
    <SafeAreaView>
    <Modal visible={showLocation}
    transparent={true}
    statusBarTranslucent={true}
    animationType="slide">
      <View style={styles.modalContainer}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => closeLocation()} style={{alignItems: 'flex-start', width: '25%', padding: 12}}>
          <Text style={styles.headingText}>Cancel</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', width: '50%', padding: 10}}>
          <Text style={[styles.headingText, {fontSize: 20}]} numberOfLines={1}>{!newLocation ? 'Select Location' : 'New Location'}</Text>
          </View>
          <TouchableOpacity onPress={() => {!newLocation ? setEdit(!edit) : !selectedLocation ? setNewLocation(false) : saveLocation()}} style={{alignItems: 'flex-end', width: '25%', padding: 12}}>
          <Text style={styles.headingText}>{!newLocation ? 'Edit' : !selectedLocation ? 'Back' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        {!newLocation ?
        <ScrollView >
          <TouchableOpacity onPress={() => setNewLocation(true)} style={styles.locationContainer}>
            <Text style={styles.locationText}>New Location</Text>
            <View style={{width: '60%', alignItems: 'flex-end'}}>
              <View style={styles.addContainer}>
                <Icon name="add" size={40} color={'red'}/>
              </View>
            </View>
          </TouchableOpacity>
          {preExistingLocations.map(location => {
            return (<TouchableOpacity style={styles.locationContainer} onPress={() => {onSelect(location.name); closeLocation();}}>
            <View>
              <Text style={{color: 'black', fontSize: 18, fontWeight: '500'}}>{location.name}</Text>
              <Text>{location.street}</Text>
              <Text>{location.city}</Text>
              <Text>{location.postalCode}</Text>
            </View>
            <View style={{position: 'absolute', right: 0}}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  region={region || {
                    latitude: location.geometry.location.lat,
                    longitude: location.geometry.location.long,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
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
                      coordinate={marker.latlng || {
                        latitude: location.geometry.location.lat,
                        longitude: location.geometry.location.long,
                      }}
                      title={location.name}>
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
            {edit ? 
              <View style={{backgroundColor: 'red', width: 100, height: '100%'}}>
                <Icon name="trash-outline"/>
              </View>
              :
              null
            }
          </TouchableOpacity>)
          })}
        </ScrollView>
        :
          (!selectedLocation ?
          <View style={{height: 6*60, width: '100%', backgroundColor: 'white'}}>
            <UiInput 
              placeholder={"New Location"}
              fontSize={20}
              icon={'location'}
              onChangeText={searchPlaces}
            />
            <ScrollView>
            {locationOptions.map(option => { return (
              <TouchableOpacity onPress={() => onSelectLocation(option.place_id)} style={{alignItems: 'center', width: '100%', height: 60, backgroundColor:'#A9A9A9', padding: 10, paddingRight: 50, flexDirection: 'row', borderBottomWidth: 0.5}}>
                <Icon name={'location'} size={20} style={{marginRight: 10}}/>
                <View>
                  <Text numberOfLines={1} style={{color: 'black', fontSize: 16, fontWeight: '500'}}>{option.structured_formatting.main_text}</Text>
                  <Text numberOfLines={1} style={{color: 'black'}}>{option.structured_formatting.secondary_text}</Text>
                </View>
              </TouchableOpacity>
            )})}
            {search !== '' && <TouchableOpacity onPress={() => onSelectLocation(search)} style={{alignItems: 'center', width: '100%', height: 60, backgroundColor:'#A9A9A9', padding: 10, paddingRight: 50, flexDirection: 'row'}}>
            <Icon name={'location'} size={20} style={{marginRight: 10}}/>
              <View>
              <Text numberOfLines={1} style={{color: 'black', fontSize: 16, fontWeight: '500'}}>{search}</Text>
              </View>
            </TouchableOpacity>}
            </ScrollView>
          </View>
          :
            <View>
              <UiInput placeholder={'Title'} initialValue={selectedLocation.name} fontSize={18} onChangeText={() => {}}/>
              <UiInput placeholder={'Location'} initialValue={selectedLocation.formatted_address} fontSize={16} onChangeText={() => {}}/>
            </View>
          )
        }
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
