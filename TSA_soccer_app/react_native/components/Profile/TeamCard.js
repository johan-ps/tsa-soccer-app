import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { UiSwitch, UiImage, UiIcon } from '../_components';

const TeamCard = props => {
  const { value = false, teamImg = null, teamName } = props;
  const theme = useSelector(state => state.theme.colors);

  const toggleScale = () => {
    if (Platform.OS === 'ios') {
      return { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] };
    } else {
      return { transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] };
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContentWrapper}>
        <View style={styles.cardImgWrapper}>
          <UiImage
            style={styles.cardImg}
            source={teamImg}
            resizeMode="cover"
            cond={!!teamImg && teamImg !== 'null'}
            alt={
              <UiIcon
                icon="football"
                color={theme.secondaryText}
                backgroundColor={theme.secondaryBg}
                size={20}
                darkBg={theme.name === 'dark'}
              />
            }
          />
        </View>
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.name,
              { color: theme.primaryText, fontFamily: theme.fontBold },
            ]}>
            {teamName}
          </Text>
        </View>
      </View>
      <UiSwitch
        style={toggleScale()}
        trackColor={{ false: '#767577', true: '#E41B23' }}
        onValueChange={props.onToggle}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowRadius: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 5 },
    borderRadius: 10,
  },
  cardContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardContent: {
    marginLeft: 15,
  },
  cardImgWrapper: {
    overflow: 'hidden',
    height: 50,
    width: 50,
    borderRadius: 15,
  },
  cardImg: {
    height: '100%',
    width: '100%',
  },
});

export default TeamCard;
