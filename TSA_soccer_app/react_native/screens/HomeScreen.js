import React from 'react';
import { Button, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HomeScreen = () => {
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: true,
  };

  const triggerVibration = () => {
    console.log('trigger vibration');
    ReactNativeHapticFeedback.trigger('impactLight', options);
  };

  return (
    <View>
      <Button title="Vibrate" onPress={triggerVibration} />
    </View>
  );
};

export default HomeScreen;
