import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Modal, Easing, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import UiButton from './UiButton';

const UiModal = props => {
  let { visible } = props;
  const [showModal, setShowModal] = useState(visible);
  const showModalAnimation = useRef(new Animated.Value(0)).current;
  const theme = useSelector(state => state.theme.colors);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(showModalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => {
        setShowModal(false);
      }, 200);
      Animated.timing(showModalAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    toggleModal();
  }, [visible]);

  const scale = {
    transform: [
      {
        scale: showModalAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const opacity = {
    opacity: showModalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <Modal transparent={true} visible={showModal}>
      <Animated.View style={[styles.modalViewContainer, opacity]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.cardBgClr },
            scale,
            opacity,
          ]}>
          <View style={styles.textContainer}>
            <Text style={{ ...styles.title, color: theme.cardHClr }}>
              {props.title}
            </Text>
            <Text style={{ ...styles.content, color: theme.cardCClr }}>
              {props.content}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <UiButton
              label={props.secondaryLabel}
              bgColor={theme.secondaryBtnBgClr}
              textColor={theme.secondaryBtnClr}
              onPress={props.onCloseHandler}
            />
            <UiButton
              label={props.primaryLabel}
              bgColor={theme.primaryBtnBgClr}
              textColor={theme.primaryBtnClr}
              onPress={props.onCloseHandler}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalViewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    height: '32%',
    maxHeight: 230,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
    zIndex: 10,
  },
  textContainer: {
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  content: {
    fontSize: 14,
    marginBottom: 15,
    color: '#848484',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default UiModal;
