import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';

const AnnouncementCard = props => {
  const { image = null } = props;
  const desc =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dui sapien, gravida at justo et, dapibus malesuada odio. Morbi eget fermentum lacus. Aenean dictum mauris nibh,';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContentWrapper}>
          <View style={styles.headerImgWrapper}>
            <Image
              style={styles.headerImg}
              source={{
                uri: 'https://cps-static.rovicorp.com/3/JPG_400/MI0004/652/MI0004652833.jpg?partner=allrovi.com',
              }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.headerContent}>
            <Text style={styles.name}>Coach Gryffin</Text>
            <Text style={styles.date}>28 Oct 2020</Text>
          </View>
        </View>
        <Ripple style={styles.iconContainer}>
          <Icon name="ellipsis-vertical" size={20} color="black" />
        </Ripple>
      </View>
      <View style={styles.body}>
        {image ? (
          <View style={styles.imageContainer}>
            {/* <Image style={styles.image} source={require('../assets/images/kids-playing-soccer.jpg')} resizeMode='cover' /> */}
            <Image
              style={styles.image}
              source={{
                uri: image,
              }}
              resizeMode="cover"
            />
          </View>
        ) : null}
        <View style={styles.bodyContentWrapper}>
          <Text style={styles.bodyContent}>{desc}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffffcc',
    padding: 15,
    borderRadius: 40,
    marginVertical: 10,
    // elevation: 5,
    // shadowRadius: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.3,
    // shadowOffset: { height: 15 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContent: {
    marginLeft: 15,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  date: {
    fontSize: 13,
    color: 'grey',
  },
  headerImgWrapper: {
    overflow: 'hidden',
    height: 60,
    width: 60,
    borderRadius: 50,
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
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 30,
    elevation: 20,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
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
    color: '#00000099',
  },
});

export default AnnouncementCard;
