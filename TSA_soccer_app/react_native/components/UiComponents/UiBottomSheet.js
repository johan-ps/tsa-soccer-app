import React, {
  useCallback,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetFooter,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import UiButton from './UiButton';
import UiIconButton from './UiIconButton';

const UiBottomSheet = forwardRef((props, ref) => {
  const {
    snaps = ['80%'],
    footerLabel = null,
    icon,
    title = '',
    borderRadius = 35,
    width = 45,
    secondaryLabel = null,
  } = props;
  const theme = useSelector(state => state.theme.colors);
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => snaps, [snaps]);

  useImperativeHandle(ref, () => ({
    snapToIndex,
  }));

  const snapToIndex = index => {
    bottomSheetRef.current.snapToIndex(index);
  };

  const closeSheet = () => {
    bottomSheetRef.current.close();
    onCloseHandler();
  };

  const onCloseHandler = useCallback(() => {
    props.onCloseHandler();
  }, [props]);

  const handleSheetChanges = useCallback(
    (fromIndex, toIndex) => {
      if (toIndex === -1) {
        onCloseHandler();
      }
    },
    [onCloseHandler],
  );

  const primaryBtnHandler = () => {
    if (props.primaryBtnHandler) {
      props.primaryBtnHandler();
    }
  };

  const secondaryBtnHandler = () => {
    if (props.secondaryBtnHandler) {
      props.secondaryBtnHandler();
    }
  };

  const renderFooter = (() => {
    if (footerLabel) {
      return props => (
        <BottomSheetFooter
          {...props}
          bottomInset={Platform.OS === 'ios' ? 250 : 20}>
          <View
            style={[styles.bottomSheetFooter, { shadowColor: theme.addBtnBg }]}>
            <UiButton
              width="100%"
              height={62}
              borderRadius={16}
              style={styles.button}
              primaryClr={theme.buttonPrimaryBg}
              secondaryClr={theme.buttonPrimaryText}
              label={footerLabel}
              onPress={primaryBtnHandler}
              size="medium"
              darkBg={true}
            />
          </View>
        </BottomSheetFooter>
      );
    } else {
      return null;
    }
  })();

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <>
      <BottomSheet
        style={[styles.bottomSheet, { borderRadius }]}
        handleIndicatorStyle={{
          backgroundColor: theme.tertiaryText,
          width,
        }}
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        onAnimate={handleSheetChanges}
        backgroundStyle={{ borderRadius }}
        footerComponent={renderFooter}
        backdropComponent={renderBackdrop}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.primaryBg }]}>
          <UiIconButton
            icon="close"
            color={theme.secondaryText}
            backgroundColor={theme.secondaryBg}
            size={20}
            darkBg={false}
            onPress={closeSheet}
          />
          <View style={styles.headingContainer}>
            <Text
              style={[
                styles.heading,
                { fontFamily: theme.fontBold, color: theme.primaryText },
              ]}>
              {title}
            </Text>
            {/* <View><Text>Hello</Text></View> */}
            {/* {icon && (
              <TouchableOpacity
                onPress={props.iconHandler}
                style={styles.iconContainer}>
                {icon}
              </TouchableOpacity>
            )} */}
          </View>
          <TouchableOpacity
            onPress={secondaryBtnHandler}
            style={styles.secondaryLabelContainer}>
            {secondaryLabel && (
              <Text
                style={[
                  styles.secondaryLabel,
                  { fontFamily: theme.fontRegular, color: theme.secondaryText },
                ]}>
                {secondaryLabel}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView>
          <View style={styles.bottomSheetContent}>{props.children}</View>
          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  secondaryLabelContainer: {
    padding: 10,
  },
  secondaryLabel: {
    fontSize: 14,
  },
  bottomSheetContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  bottomSheetFooter: {
    paddingHorizontal: 15,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    shadowOffset: { height: 10 },
    zIndex: 200,
  },
  closeBtn: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  marginTop: {
    marginTop: 40,
  },
  modalContainer: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    marginBottom: 15,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    padding: 5,
  },
  contentWrapper: {
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 20,
  },
  headingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 50,
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    elevation: 24,
    borderTopStartRadius: 0,
    borderTopEndRadius: 0,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    shadowColor: '#000000',
    zIndex: 200,
  },
});

export default memo(UiBottomSheet);
