import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';

const LoadingSkeleton = props => {
  const theme = useSelector(state => state.theme.colors);
  const { length = 3 } = props;
  const [template] = useState(Array(length).fill(0));

  return (
    <View>
      {template.map((_, i) => (
        <View
          key={i}
          style={[styles.container, { backgroundColor: theme.primaryBg }]}>
          <SkeletonPlaceholder>
            <View style={[styles.container]}>
              <View style={styles.header}>
                <View style={styles.profileImg} />
                <View style={styles.headingContent}>
                  <View style={styles.author} />
                  <View style={styles.date} />
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.image} />
                <View style={styles.description}>
                  <View style={styles.descLine1} />
                  <View style={styles.descLine1} />
                  <View style={styles.descLine2} />
                </View>
              </View>
            </View>
          </SkeletonPlaceholder>
        </View>
      ))}
    </View>
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
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  headingContent: {
    marginLeft: 15,
  },
  author: {
    width: 200,
    height: 20,
    borderRadius: 5,
    marginBottom: 5,
  },
  date: {
    width: 120,
    height: 15,
    borderRadius: 5,
  },
  body: {
    paddingHorizontal: 15,
  },
  image: {
    height: 250,
    width: '100%',
    borderRadius: 10,
  },
  description: {
    paddingVertical: 10,
  },
  descLine1: {
    width: '100%',
    height: 12,
    borderRadius: 3,
    marginBottom: 5,
  },
  descLine2: {
    width: 120,
    height: 12,
    borderRadius: 3,
    marginBottom: 5,
  },
});

export default LoadingSkeleton;
