import { ThemeProvider } from '@react-navigation/native';
import React, { useState, useRef, useEffect, useCallback, useReducer } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Modal, TouchableOpacity, Image, Animated, ScrollView, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import UiInput from '../UiComponents/UiInput';
import { Easing } from 'react-native-reanimated';
import * as locationActions from '../../store/actions/LocationActions'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formInit = {
  inputValues: {
    name: '',
    street: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: ''
  },
  inputValidities: {
    name: true,
    street: true,
    city: true,
    province: true,
    country: true,
    postalCode: true,
    latitude: true,
    longitude: true
  },
  formIsValid: true,
};

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (let key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  } else {
    return formInit;
  }
};


const EventLocation = props => {
  const { showLocation, closeLocation, onSelect } = props;
  const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
  const theme = useSelector(state => state.theme.colors);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState('')
  const [newLocation, setNewLocation] = useState(false);
  const preExistingLocations = useSelector(state => state.locations);
  const [locationOptions, setLocationOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, formInit);

  const onChange = useCallback(
    (inputId, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputId,
      });
    },
    [dispatchFormState],
  );


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

  const loadLocations = useCallback(async () => {
    try {
      await dispatch(locationActions.getLocations());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  useEffect(() => {
    loadLocations();
  }, [dispatch, loadLocations]);

  const searchPlaces = async (aSearchString) => {
    setSearch(aSearchString);
    if (aSearchString.trim() === '') return
    const location = '43.651890,-79.381706';
    const radius = 500000;
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json?key=AIzaSyB-HOOioh0lR-hXaggyEzYXVFKdylnbpFk&libraries=places&input=${encodeURIComponent(aSearchString)}&location=${encodeURIComponent(location)}&radius=${encodeURIComponent(radius)}`
    fetch(apiUrl).then((response) => response.json())
    .then((result) => {
      console.log("Joell result", result);
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
    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      onChange('name', data.result.name, true);
      onChange('latitude', data.result.geometry.location.lat, true);
      onChange('longitude', data.result.geometry.location.lng, true);
      let number = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('street_number')){
          return true;
        }
        return false;
      })];
      number = number && number.long_name;
      let street = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('route')){
          return true;
        }
        return false;
      })];
      street = street && street.long_name;
      if(number){
        street = number + ' ' + street;
      }
      onChange('street', street, true);
      let city = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('locality')){
          return true;
        }
        return false;
      })];
      city = city && city.long_name;
      onChange('city', city, true);
      let province = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('administrative_area_level_1')){
          return true;
        }
        return false;
      })];
      province = province && province.long_name;
      onChange('province', province, true);
      let postalCode = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('postal_code')){
          return true;
        }
        return false;
      })]
      postalCode = postalCode && postalCode.long_name;
      onChange('postalCode', postalCode, true);
      let country = data.result.address_components[data.result.address_components.findIndex(component => {
        if(component.types.includes('country')){
          return true;
        }
        return false;
      })];
      country = country && country.long_name;
      onChange('country', country, true);
      setSelectedLocation({name: data.result.name, street: number + ' ' + street, city, province, postalCode, country})
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const changeSelectedLocation = (key, value) => {
    onChange(key, value, true);
  }

  const saveLocation = () => {
    createLocationHandler(formState.inputValues);
  }

  const createLocationHandler = async (selectedLocation) => {
    try {
      const location = await dispatch(
        locationActions.createLocation(selectedLocation)
      );
      onSelect(location);
      closeLocation();
      setNewLocation(false);
      setSelectedLocation(null);
      dispatchFormState({ type: 'reset' });
    } catch (err) {
      console.log("error", err);
    }
    
  };

  const deleteLocationHandler = async (id) => {
    await dispatch(
      locationActions.deleteLocation(id)
    );
  }


  return (
    <SafeAreaView>
    <Modal visible={showLocation}
    transparent={true}
    statusBarTranslucent={true}
    animationType="slide">
      <View style={[styles.modalContainer, { backgroundColor: theme.secondaryBg }]}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => closeLocation()} style={{alignItems: 'flex-start', width: '25%', padding: 12}}>
          <Text style={[styles.headingText, {color: theme.cardTextSubHeading}]}>Cancel</Text>
          </TouchableOpacity>
          <View style={{alignItems: 'center', width: '50%', padding: 10}}>
          <Text style={[styles.headingText, {fontSize: 20,  color: theme.cardTextSubHeading}]} numberOfLines={1}>{!newLocation ? 'Select Location' : 'New Location'}</Text>
          </View>
          <TouchableOpacity onPress={() => {!newLocation ? setEdit(!edit) : !selectedLocation ? setNewLocation(false) : saveLocation()}} style={{alignItems: 'flex-end', width: '25%', padding: 12}}>
          <Text style={[styles.headingText,  {color: theme.cardTextSubHeading}]}>{!newLocation ? edit ? 'Done' : 'Edit' : !selectedLocation ? 'Back' : 'Save'}</Text>
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
          {preExistingLocations && preExistingLocations.map((location, index) => {
            return (
          <TouchableOpacity key={index} style={styles.locationContainer} onPress={() => {onSelect(location); closeLocation();}}>
            <View>
              <Text style={{color: theme.cardTextSubHeading, fontSize: 18, fontWeight: '500'}}>{location.name}</Text>
              <Text style={{color: theme.cardTextSubHeading}}>{location.street}</Text>
              <Text style={{color: theme.cardTextSubHeading}}>{location.city}</Text>
              <Text style={{color: theme.cardTextSubHeading}}>{location.postalCode}</Text>
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
              <TouchableOpacity style={{backgroundColor: 'red', width: 80, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Icon name="trash-outline" size={35} color={'white'} />
                <Text style={{fontSize: 14, color: 'white'}}>Delete</Text>
              </TouchableOpacity>
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
              initialValue={selectedLocation && selectedLocation.name}
              icon={'location'}
              onChangeText={searchPlaces}
            />
            <ScrollView>
            {locationOptions.map((option, index) => { return (
              <TouchableOpacity key={index} onPress={() => onSelectLocation(option.place_id)} style={{alignItems: 'center', width: '100%', height: 60, backgroundColor:'#A9A9A9', padding: 10, paddingRight: 50, flexDirection: 'row', borderBottomWidth: 0.5}}>
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
              <UiInput placeholder={'Name'} initialValue={formState.inputValues.name} fontSize={18} onChangeText={(value) => changeSelectedLocation('name', value)}/>
              <UiInput placeholder={'Street'} initialValue={formState.inputValues.street} fontSize={16} onChangeText={(value) => changeSelectedLocation('street', value)}/>
              <UiInput placeholder={'City/Locality'} initialValue={formState.inputValues.city} fontSize={16} onChangeText={(value) => changeSelectedLocation('city', value)}/>
              <UiInput placeholder={'Province/Region'} initialValue={formState.inputValues.province} fontSize={16} onChangeText={(value) => changeSelectedLocation('province', value)}/>
              <UiInput placeholder={'Postal Code/Zip Code'} initialValue={formState.inputValues.postalCode} fontSize={16} onChangeText={(value) => changeSelectedLocation('postalCode', value)}/>
              <UiInput placeholder={'Country'} initialValue={formState.inputValues.country} fontSize={16} onChangeText={(value) => changeSelectedLocation('country', value)}/>
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
