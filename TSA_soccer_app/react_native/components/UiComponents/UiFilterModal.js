import React, { useEffect, useState, useCallback } from 'react';
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
import { formatTeams } from '../../Util/utilities';
import { UiButton, UiDropdown } from '../_components';

const UiFilterModal = props => {
  let { visible } = props;
  const [showModal, setShowModal] = useState(visible);
  const theme = useSelector(state => state.theme.colors);
  const modalAnimation = useSharedValue(0);
  const [selectedTeams, setSelectedTeams] = useState(null);

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
      props.primaryBtnHandler(selectedTeams);
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

  const teams = useSelector(state => formatTeams(state.teams));

  const onSelectHandler = useCallback(inputValue => {
    if (inputValue) {
      let selectedTeamsArr = [];

      for (let group in inputValue) {
        for (let teamId in inputValue[group].children) {
          selectedTeamsArr.push(teamId);
        }
      }

      setSelectedTeams(selectedTeamsArr);
    }
  }, []);

  return (
    <Modal transparent={true} visible={showModal}>
      <Animated.View style={[styles.modalViewContainer, opacity]}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.cardBg },
            animStyle,
          ]}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                { color: theme.primaryText, fontFamily: theme.fontMedium },
              ]}>
              {props.title}
            </Text>
            <View>
              <UiDropdown
                options={teams}
                multiselect={true}
                group={true}
                placeholder="Choose teams"
                size="large"
                optionSize="large"
                onSelect={onSelectHandler}
              />
            </View>
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
  modalContainer: {
    borderRadius: 16,
    padding: 26,
    width: '90%',
    height: '60%',
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
  content: {
    fontSize: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
});

export default UiFilterModal;
