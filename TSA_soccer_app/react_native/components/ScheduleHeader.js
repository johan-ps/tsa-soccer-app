import { ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ScheduleHeaderItem from './ScheduleHeaderItem'

const ScheduleHeader = props => {
  const { onPress } = props;
  const currentDate = moment();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const endDate = moment().endOf('month');
  const [datesArray, setDatesArray] = useState([]);

  useEffect(() => {
    let newDatesArray = [];
    let date = moment();
    while(endDate.diff(date, 'days') > 0){
      newDatesArray.push(date.clone());
      date.add(1, 'days')
    }
    setDatesArray(newDatesArray)
  }, []);


  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>{currentDate.format('MMM YYYY')}</Text>
      </View>
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false}
        style={styles.headerContainer}>
      {selectedDate ? 
        datesArray.map(date => {
          return (
            <View style={{alignItems: 'center', marginRight: 10}}>
              <ScheduleHeaderItem onPress={() => setSelectedDate(date)} 
                                  date={date}  
                                  current={selectedDate.isSame(date, 'day')}
              />
              {selectedDate.isSame(date, 'day') ? 
                <View style={styles.selected}/>
                :
                null
              }
            </View>
          )
        })
        :
        null
      }
      </ScrollView>
      <Text style={styles.subHeading}>Today</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    paddingLeft: 20,
    paddingRight: 20
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20
  },
  selected: {
    backgroundColor: '#cf4444',
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10
  }
});

export default ScheduleHeader;
