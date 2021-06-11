import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const NavHeader = props => {
  const { iconListLeft = [], iconListRight = [], searchable = false } = props;
  const theme = useSelector(state => state.theme.colors);

  return (
    <View style={[styles.container, { backgroundColor: theme.navBg }]}>
      <View style={styles.iconLeftContainer}>
        {iconListLeft.map(icon => {
          return (
            <TouchableOpacity key={icon.id} style={styles.iconContainer}>
              <Icon name={icon.name} color={theme.iconClr} size={20} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.center}>
        {searchable ? (
          <TextInput
            style={[
              styles.searchbar,
              {
                borderColor: theme.navText,
                color: theme.navText,
                backgroundColor: theme.navInputBg,
              },
            ]}
            placeholder="Search..."
            placeholderTextColor={theme.navText}
          />
        ) : null}
        {searchable ? (
          <View style={styles.searchbarIcon}>
            <Icon name="search-outline" color={theme.navText} size={20} />
          </View>
        ) : null}
      </View>
      <View style={styles.iconRightContainer}>
        {iconListRight.map(icon => {
          return (
            <TouchableOpacity key={icon.id} style={styles.iconContainer}>
              <Icon name={icon.name} color={theme.iconClr} size={20} />
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRightContainer: {
    height: '100%',
    padding: 10,
    marginRight: 10,
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
    paddingHorizontal: 20,
    paddingLeft: 40,
  },
  searchbarIcon: {
    position: 'absolute',
    top: 9,
    left: 10,
  },
});

export default NavHeader;
