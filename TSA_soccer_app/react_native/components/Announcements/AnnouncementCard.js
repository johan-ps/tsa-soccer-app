import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { UiMenu, UiImage } from '../_components';
import * as Util from '../../Util/utilities';
import UiIcon from '../UiComponents/UiIcon';

const AnnouncementCard = props => {
  const theme = useSelector(state => state.theme.colors);
  const userData = useSelector(state => state.userData);
  const {
    id,
    date,
    title,
    description,
    type,
    firstName,
    lastName,
    image,
    profileImg,
    authorId = 0,
  } = props.announcementData;

  const onSelectOption = option => {
    if (option.id === 1) {
      props.onDelete();
    }
  };

  const menuOptions = useMemo(() => {
    const edit = { id: 0, label: 'Edit' };
    const dlt = { id: 1, label: 'Delete' };
    const download = { id: 2, label: 'Download' };
    let options = [];

    if (userData) {
      if (userData.accessLevel === 1 && userData.id === authorId) {
        options = [edit, dlt];
      } else if (userData.accessLevel > 1) {
        options = [edit, dlt];
      }
    }

    if (image && image !== 'null') {
      options.push(download);
    }

    return options;
  }, [userData, authorId, image]);

  return (
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
        <View style={styles.header}>
          <View style={styles.headerContentWrapper}>
            <View style={styles.headerImgWrapper}>
              <UiImage
                style={styles.headerImg}
                source={profileImg}
                resizeMode="cover"
                cond={profileImg}
                alt={
                  <UiIcon
                    icon="person"
                    color="#aaa6c3"
                    backgroundColor={theme.cardTextHeading}
                    size={20}
                    darkBg={theme.name === 'dark'}
                  />
                }
              />
            </View>
            <View style={styles.headerContent}>
              <Text
                style={[
                  styles.name,
                  { color: theme.cardTextHeading, fontFamily: theme.fontBold },
                ]}>
                {`${firstName} ${lastName}`}
              </Text>
              <Text
                style={[
                  styles.date,
                  {
                    color: theme.cardTextSubHeading,
                    fontFamily: theme.fontLight,
                  },
                ]}>
                {Util.getTime(date)}
              </Text>
            </View>
          </View>
          <UiMenu
            onPress={onSelectOption}
            options={menuOptions}
            color={theme.cardTextHeading}
          />
        </View>
        <View style={styles.body}>
          <UiImage
            imageViewStyle={styles.imageContainer}
            style={styles.image}
            source={image}
            cond={true}
            resizeMode="cover"
          />
          <View style={styles.bodyContentWrapper}>
            <Text
              style={[
                styles.bodyContent,
                { color: theme.cardTextContent, fontFamily: theme.fontRegular },
              ]}>
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
  },
  date: {
    fontSize: 13,
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
  },
});

export default AnnouncementCard;
