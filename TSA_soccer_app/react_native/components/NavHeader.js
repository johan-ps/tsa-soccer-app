import React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';

const NavHeader = props => {
  const { iconListLeft = [], iconListRight = [], searchable = false } = props;

  return (
    <View style={styles.container}>
      <View style={styles.iconLeftContainer}>
        {iconListLeft.map(icon => {
          return (
            <Ripple key={icon.id} style={styles.iconContainer}>
              <Icon name={icon.name} color="black" size={20} />
            </Ripple>
          );
        })}
      </View>
      <View style={styles.center}>
        {searchable ? (
          <TextInput
            style={styles.searchbar}
            placeholder="Search..."
            placeholderTextColor="#D1D1D1"
          />
        ) : null}
        {searchable ? (
          <View style={styles.searchbarIcon}>
            <Icon name="search-outline" color="#D1D1D1" size={20} />
          </View>
        ) : null}
      </View>
      <View style={styles.iconRightContainer}>
        {iconListRight.map(icon => {
          return (
            <Ripple key={icon.id} style={styles.iconContainer}>
              <Icon name={icon.name} color="black" size={20} />
            </Ripple>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 15,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 15 },
  },
  iconLeftContainer: {
    height: '100%',
    padding: 10,
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRightContainer: {
    height: '100%',
    padding: 10,
    marginRight: 10,
    // backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  center: {
    width: '70%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchbar: {
    borderRadius: 60,
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D1D1D1',
    paddingHorizontal: 20,
    paddingLeft: 40,
    color: 'black',
  },
  searchbarIcon: {
    position: 'absolute',
    top: 9,
    left: 10,
  },
});

export default NavHeader;
