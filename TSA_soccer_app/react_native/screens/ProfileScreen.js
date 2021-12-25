import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NavButton from '../components/Profile/NavButton';
import UiImage from '../components/UiComponents/UiImage';
import UiIcon from '../components/UiComponents/UiIcon';
import * as ThemeActions from '../store/actions/ThemeActions';
import * as userActions from '../store/actions/UserActions';
import { useFocusEffect } from '@react-navigation/native';
import * as tabbarActions from '../store/actions/TabbarActions';

const ProfileScreen = ({ navigation }) => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const dispatch = useDispatch();

  const toggleSwitch = () => {
    let newTheme;
    if (theme.name === 'dark') {
      newTheme = 'light';
    } else {
      newTheme = 'dark';
    }
    dispatch(ThemeActions.updateTheme(newTheme));
  };

  useFocusEffect(() => {
    dispatch(tabbarActions.updateVisibility(true));
  });

  return (
    <ScrollView
      style={styles.pageContainer}
      contentContainerStyle={styles.innerPageContainer}>
      <Text style={styles.heading}>Profile</Text>
      <View style={styles.profileContainer}>
        <UiImage
          style={styles.profileImg}
          source={userData.profileImg}
          resizeMode="cover"
          cond={!!userData.profileImg && userData.profileImg !== 'null'}
          alt={
            <UiIcon
              icon="person"
              color="#aaa6c3"
              size={34}
              type="round"
              darkBg={false}
            />
          }
        />
        <View style={styles.profileInfoContainer}>
          <Text style={styles.profileName}>
            {userData && userData.authenticated
              ? `${userData.firstName} ${userData.lastName}`
              : 'Not Logged In'}
          </Text>
          {userData && userData.authenticated ? (
            <Text style={styles.profileEmail}>{userData.email}</Text>
          ) : null}
        </View>
      </View>
      <NavButton
        label="Notifications"
        onPress={() => {
          navigation.navigate('Notifications');
        }}
      />
      <NavButton
        actionType="switch"
        label="Dark Theme"
        ripple={false}
        value={theme.name === 'dark'}
        onToggle={toggleSwitch}
      />
      <NavButton label="Change Password" onPress={() => {}} />
      <NavButton label="Privacy" onPress={() => {}} />
      <NavButton label="Terms & Conditions" onPress={() => {}} />
      <NavButton
        label={userData && userData.authenticated ? 'Sign Out' : 'Sign In'}
        onPress={async () => {
          if (userData && userData.authenticated) {
            await dispatch(userActions.logoutUser());
          } else {
            navigation.navigate('Login');
          }
        }}
        icon={
          userData && userData.authenticated
            ? 'log-out-outline'
            : 'log-in-outline'
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    paddingTop: 30,
  },
  innerPageContainer: {
    paddingBottom: 100,
  },
  heading: {
    fontSize: 30,
    color: '#3D3C4E',
    fontFamily: 'Roboto-Medium',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 30,
  },
  profileInfoContainer: {
    marginLeft: 25,
  },
  profileName: {
    fontSize: 17,
    fontFamily: 'Roboto-Bold',
    color: '#3D3C4E',
  },
  profileEmail: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: '#b9b9c3',
    marginTop: 6,
  },
  profileImg: {
    borderRadius: 50,
    width: 80,
    height: 80,
  },
  optionsContainer: {},
});

export default ProfileScreen;
