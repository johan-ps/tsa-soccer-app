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

const UiBottomSheet = forwardRef((props, ref) => {
  const { snaps = ['75%'], footerComponent = null, icon, title = '' } = props;
  const theme = useSelector(state => state.theme.colors);
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => snaps, [snaps]);

  useImperativeHandle(ref, () => ({
    snapToIndex,
  }));

  const snapToIndex = index => {
    bottomSheetRef.current.snapToIndex(index);
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

  const renderFooter = useCallback(
    props => {
      footerComponent ? (
        <BottomSheetFooter
          {...props}
          bottomInset={Platform.OS === 'ios' ? 250 : 164}>
          <View style={styles.bottomSheetFooter}>{footerComponent}</View>
        </BottomSheetFooter>
      ) : null;
    },
    [footerComponent],
  );

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
        style={styles.bottomSheet}
        handleIndicatorStyle={{ backgroundColor: theme.primaryText }}
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        onAnimate={handleSheetChanges}
        footerComponent={renderFooter}
        backdropComponent={renderBackdrop}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.primaryBg }]}>
          <View style={styles.headingContainer}>
            <Text
              style={[
                styles.heading,
                { fontFamily: theme.fontBold, color: theme.primaryText },
              ]}>
              {title}
            </Text>
            {icon && (
              <TouchableOpacity
                onPress={props.iconHandler}
                style={styles.iconContainer}>
                <Icon name={icon} color={theme.primaryText} size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <BottomSheetScrollView>
          {props.children}
          <View style={{ height: 300 }} />
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContent: {
    paddingHorizontal: 15,
  },
  bottomSheetFooter: {
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
  },
  textContainer: {
    padding: 5,
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
    fontSize: 24,
    marginBottom: 15,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
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
