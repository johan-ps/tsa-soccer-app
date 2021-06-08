import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { AnnouncementCard, NavHeader, AddButton } from '../components/_components';

const AnnouncementScreen = () => {
  const addBtnRef = useRef();
  const [offsetY, setOffsetY] = useState(0);

  const onScrollHandler = event => {
    const prevOffsetY = offsetY;
    const curOffsetY = event.nativeEvent.contentOffset.y;
    if (Math.abs(curOffsetY - prevOffsetY) > 8) {
      if (curOffsetY < prevOffsetY) {
        addBtnRef.current.onScrollUp();
      } else {
        addBtnRef.current.onScrollDown();
      }
    } else if (curOffsetY === 0) {
      addBtnRef.current.onScrollUp();
    }
    setOffsetY(curOffsetY);
  };

  return (
    <LinearGradient colors={['#F37335', '#FDC830']} style={styles.container}>
      {/* <NavHeader
        iconListRight={[{ name: 'filter-outline', id: 0 }]}
        searchable={true}
      /> */}
      <ScrollView style={styles.body} onScroll={onScrollHandler}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Announcements</Text>
        </View>
        <AnnouncementCard image="https://th.bing.com/th/id/Red4f2866d59316ec64f269b0813412c5?rik=zdwSc4unAQCGKQ&pid=ImgRaw" />
        <AnnouncementCard image="https://images.unsplash.com/photo-1511798616182-aab3698ac53e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=583&q=80" />
        <AnnouncementCard />
        <AnnouncementCard image="https://images.unsplash.com/photo-1615458318132-1f151a3d18f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80" />
      </ScrollView>
      <AddButton ref={addBtnRef} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CBCBCB',
    alignItems: 'center',
    paddingHorizontal: 4,
    width: '100%',
    height: '100%',
  },
  header: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  body: {},
});

export default AnnouncementScreen;
