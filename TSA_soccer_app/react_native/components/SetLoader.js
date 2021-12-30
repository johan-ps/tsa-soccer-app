import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';

const loadingLottieAnim = require('../assets/img/global-load-anim.json');

const SetLoader = props => {
  const visible = useSelector(state => state.loading.visible);

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.loadingContainer}>
          <LottieView
            style={styles.lottieView}
            autoPlay={true}
            source={loadingLottieAnim}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: 100,
    height: 100,
  },
});

export default SetLoader;
