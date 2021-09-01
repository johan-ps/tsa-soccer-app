import React, { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import ErrorMessages from '../../constants/ErrorMessages';
import { useSelector } from 'react-redux';

const ErrorMessage = props => {
  const { isValid = true, errCode = null } = props;
  const theme = useSelector(state => state.theme.colors);

  const error = useMemo(() => {
    return errCode ? ErrorMessages[errCode] : '';
  }, [errCode]);

  return (
    <>
      {!isValid ? (
        <Animated.View style={styles.errorContainer}>
          <Icon color={theme.error} name="alert-circle-outline" size={20} />
          <Text
            style={[
              styles.errMsg,
              { fontFamily: theme.fontRegular, color: theme.error },
            ]}>
            {error}
          </Text>
        </Animated.View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    bottom: -25,
    left: 0,
    flexDirection: 'row',
  },
  errMsg: {
    fontSize: 13,
    marginLeft: 5,
  },
});

export default ErrorMessage;
