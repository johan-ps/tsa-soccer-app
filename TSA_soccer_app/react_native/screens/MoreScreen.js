import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight, Switch, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch} from 'react-redux';
import * as ThemeActions from '../store/actions/ThemeActions';

// TODO: Edit Profile, Change Theme, 

const MoreScreen = () => {

  const settingsOptions = [
    {title:'Notifications', iconName:'notifications-circle-outline'}, 
    {title:'Game Log', iconName:'newspaper-outline'}, 
    {title:'Statistics', iconName:'stats-chart-outline'},
    {title:'Help', iconName:'information-circle-outline'},
    {title:'Dark Mode', iconName:'moon-outline'}, 
    {title:'Log Out', iconName:'log-out-outline'}
  ]
  const STYLES = ['default', 'light-content'];

  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.colors);
  const activeTheme = useSelector(state => state.theme.activeTheme);
  const [isEnabled, setIsEnabled] = useState(activeTheme === 'default' ? false : true);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);


  const toggleSwitch = (value) => {
    let newTheme;
    if (value) {
      newTheme = 'dark'
    } else {
      newTheme = 'default'
    }
    dispatch(ThemeActions.updateTheme(newTheme));
    changeStatusBarStyle(newTheme);
    setIsEnabled(previousState => !previousState);
  }

  const changeStatusBarStyle = (newTheme) => {
    if (newTheme === 'dark') {
      setStatusBarStyle('light-content')
    } else {
      setStatusBarStyle('default')
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.primaryBtnClr}]}>
      <StatusBar
        //animated={true}
        //backgroundColor="#61dafb"
        barStyle={statusBarStyle}
        //hidden={hidden} 
      />
      <View style={styles.headerContainer}>
        <Image
          style={styles.profilePicture}
          source={{
            uri: 'https://www.thenation.com/wp-content/uploads/2021/01/irving-img.jpg',
          }}
        />
        <Text style={[styles.title, {color: theme.cardHClr}]}>Kyrie Irving</Text>
        <TouchableHighlight style={{borderRadius: 20, marginTop: 10}} onPress={()=>{}}>
          <View style={styles.editProfileButton}>
            <Text style={styles.editProfile}>Edit Profile</Text>
            <Icon name="chevron-forward-outline" size={15} color="white" style={{ paddingRight: 10}}/>
          </View>
        </TouchableHighlight>
      </View>
      <View>
        <Text style={[styles.listHeading, {backgroundColor: theme.moreScreenSettingsBgClr}]}>Settings</Text>
      </View>
      <View style={styles.optionsContainer}>
        {settingsOptions.map((setting) => (
          <TouchableHighlight 
          onPress={setting.title === 'Dark Mode' ? null : ()=>{}} 
          underlayColor={'#C0C0C0'}
          style={{width: '100%'}}
          >
            <View style={[styles.optionContainer, {backgroundColor: theme.moreScreenOptionsBgClr, borderBottomColor:'grey', borderBottomWidth: 0.5}]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name={setting.iconName} size={20} color={theme.cardHClr}/>
                <Text style={[styles.options, {color:theme.cardHClr}]}>{setting.title}</Text>
              </View>
              {setting.title === 'Dark Mode' ? 
                <Switch
                style={{ transform:[{ scaleX: .8 }, { scaleY: .8 }] }}
                  trackColor={{ false: "#767577", true: "#767577" }}
                  //ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
                :
                <Icon name="chevron-forward-outline" size={18} color={theme.cardHClr}/>
              }
            </View>
          </TouchableHighlight>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  optionsContainer:{
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 16,
    width: '100%'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: 'grey',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 20,
    height: 40
  },
  options: {
    color: 'black',
    fontSize: 15,
    paddingLeft: 10,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  title: {
    fontSize: 28,
    paddingTop: 10,
    paddingBottom: 5
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20
  },
  editProfile: {
    borderRadius: 20,
    color: 'white',
    padding: 12
  },
  editProfileButton: {
    backgroundColor: '#e84343',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent:'center',
    alignItems: 'center',
  },
  listHeading: {
    fontSize: 14,
    width: '100%',
    padding: 8,
    backgroundColor: '#F0F0F0',
    color: '#696969'
  }
});

export default MoreScreen;
