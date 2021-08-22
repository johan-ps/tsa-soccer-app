import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';

import UiButton from '../UiComponents/UiButton';
import Icon from 'react-native-vector-icons/Ionicons';

const UiModal = props => {
  let { visible, icon, closeable = false } = props;
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

  const onCloseHandler = () => {
    if (props.onClose) {
      props.onClose();
    }
  };
  return (
    <Modal transparent={true} visible={showModal}>
      <Animated.View style={[styles.modalViewContainer, opacity]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.cardBg },
            animStyle,
          ]}>
          {closeable && (
            <TouchableOpacity style={styles.closeBtn} onPress={onCloseHandler}>
              <Icon name="close-outline" color={theme.primaryText} size={40} />
            </TouchableOpacity>
          )}
          <View style={styles.textContainer}>
            {icon && <Icon name={icon} color={theme.primaryText} size={40} />}
            <Text
              style={[
                styles.title,
                { color: theme.primaryText, fontFamily: theme.fontMedium },
                icon ? styles.marginTop : {},
              ]}>
              {props.title}
            </Text>
            <Text
              style={[
                styles.content,
                { color: theme.cardTextContent, fontFamily: theme.fontRegular },
              ]}>
              {props.content}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <UiButton
              primaryClr={theme.button4Txt}
              secondaryClr={theme.button4Bg}
              label={props.secondaryLabel}
              onPress={secondaryBtnHandler}
              type="secondary"
              size="medium"
              borderRadius={10}
              darkBg={true}
              width={130}
              height={50}
            />
            <UiButton
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr={theme.button4Txt}
              label={props.primaryLabel}
              onPress={primaryBtnHandler}
              size="medium"
              borderRadius={10}
              darkBg={true}
              width={130}
              height={50}
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
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalContainer: {
    borderRadius: 16,
    padding: 26,
    width: '90%',
    maxWidth: 350,
    flexDirection: 'column',
    justifyContent: 'space-between',
    elevation: 20,
    shadowRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { height: 20 },
    zIndex: 20,
    position: 'relative',
  },
  textContainer: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  marginTop: {
    marginTop: 30,
  },
  content: {
    fontSize: 15,
    marginBottom: 25,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default UiModal;
