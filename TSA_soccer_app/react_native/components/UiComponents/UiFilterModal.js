import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import { UiButton, UiDropdown } from '../_components';

const UiFilterModal = props => {
  let { visible } = props;
  const [showModal, setShowModal] = useState(visible);
  const theme = useSelector(state => state.theme.colors);
  const modalAnimation = useSharedValue(0);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      modalAnimation.value = withSpring(1, {
        damping: 10,
        mass: 1,
        stiffness: 100,
        overshootClamping: true,
      });
    } else {
      modalAnimation.value = withTiming(0, {}, () => {
        runOnJS(setShowModal)(false);
      });
    }
  };

  useEffect(() => {
    toggleModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(modalAnimation.value, [0, 1], [0.5, 1]),
        },
      ],
      opacity: modalAnimation.value,
    };
  });

  const opacity = useAnimatedStyle(() => {
    return {
      opacity: modalAnimation.value,
    };
  });

  const primaryBtnHandler = () => {
    if (props.primaryBtnHandler) {
      props.primaryBtnHandler();
    }
    if (props.onCloseHandler) {
      props.onCloseHandler();
    }
  };

  const secondaryBtnHandler = () => {
    if (props.secondaryBtnHandler) {
      props.secondaryBtnHandler();
    }
    if (props.onCloseHandler) {
      props.onCloseHandler();
    }
  };

  const teams = [
    {
      label: 'House League',
      id: 0,
      children: [
        {
          label: 'Markham House League',
          id: 10,
        },
        {
          label: 'Scarborough House League',
          id: 17,
        },
      ],
    },
    {
      label: 'Rep',
      id: 1,
      children: [
        {
          label: 'U14',
          id: 13,
        },
        {
          label: 'U11',
          id: 14,
        },
        {
          label: 'U10',
          id: 15,
        },
        {
          label: 'U9',
          id: 16,
        },
      ],
    },
  ];

  return (
    <Modal transparent={true} visible={showModal}>
      <Animated.View style={[styles.modalViewContainer, opacity]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.cardBgClr },
            animStyle,
          ]}>
          <View style={styles.textContainer}>
            <Text style={{ ...styles.title, color: theme.cardHClr }}>
              {props.title}
            </Text>
            <View>
              <UiDropdown
                modalOffsetY={220}
                modalOffsetX={42}
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <UiButton
              primaryClr={theme.buttonSecondaryText}
              secondaryClr={theme.buttonSecondaryBg}
              label={props.secondaryLabel}
              onPress={secondaryBtnHandler}
              type="secondary"
              size="medium"
            />
            <UiButton
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr={theme.buttonPrimaryText}
              label={props.primaryLabel}
              onPress={primaryBtnHandler}
              size="medium"
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
    borderRadius: 10,
    padding: 16,
    width: '90%',
    maxWidth: 400,
    height: '60%',
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
    fontSize: 15,
    marginBottom: 15,
    color: '#848484',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default UiFilterModal;
