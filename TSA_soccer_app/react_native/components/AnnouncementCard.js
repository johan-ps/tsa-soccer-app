import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { UiMenu } from '../components/_components';
import * as Util from '../Util/utilities';

const AnnouncementCard = props => {
  const theme = useSelector(state => state.theme.colors);
  const { id, date, title, description, type, author, imageUrl, authorImgUrl } =
    props.announcementData;

  const onSelectOption = option => {
    if (option.id === 1) {
      props.onDelete();
    }
  };

  return (
    <SafeAreaView>
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <View style={styles.header}>
        <View style={styles.headerContentWrapper}>
          <View style={styles.headerImgWrapper}>
            <Image
              style={styles.headerImg}
              source={{
                uri: authorImgUrl,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={[styles.name, { color: theme.cardTextHeading }]}>
              {author}
            </Text>
            <Text style={[styles.date, { color: theme.cardTextSubHeading }]}>
              {Util.getTime(date)}
            </Text>
          </View>
        </View>
        <UiMenu
          onPress={onSelectOption}
          options={[
            { id: 0, label: 'Edit' },
            { id: 1, label: 'Delete' },
            { id: 2, label: 'Download' },
          ]}
        />
      </View>
      <View style={styles.body}>
        {imageUrl ? (
          <View style={styles.imageContainer}>
            {/* <Image style={styles.image} source={require('../assets/images/kids-playing-soccer.jpg')} resizeMode='cover' /> */}
            <Image style={styles.image} source={imageUrl} resizeMode="cover" />
          </View>
        ) : null}
        <View style={styles.bodyContentWrapper}>
          <Text style={[styles.bodyContent, { color: theme.cardTextContent }]}>
            {description}
          </Text>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContent: {
    marginLeft: 15,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  date: {
    fontSize: 13,
    fontFamily: 'Roboto-Light',
  },
  headerImgWrapper: {
    overflow: 'hidden',
    height: 50,
    width: 50,
    borderRadius: 15,
    elevation: 20,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
  },
  headerImg: {
    height: '100%',
    width: '100%',
  },
  body: {},
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bodyContentWrapper: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  bodyContent: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
});

export default AnnouncementCard;
