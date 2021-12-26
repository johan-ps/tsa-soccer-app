import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

const ImageUpload = props => {
  const { imgUrl = null } = props;
  const theme = useSelector(state => state.theme.colors);

  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (typeof imgUrl === 'string') {
      setImgSrc({ uri: imgUrl });
    } else {
      setImgSrc(imgUrl);
    }
  }, [setImgSrc, imgUrl]);

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={props.onPress}
        style={styles.touchable}
        background={TouchableNativeFeedback.Ripple(
          theme.name === 'dark'
            ? theme.touchableBgDark
            : theme.touchableBgLight,
          false,
        )}>
        <View
          style={[
            styles.container,
            styles.content,
            { backgroundColor: theme.secondaryBg },
          ]}>
          {!imgUrl ? (
            <View style={styles.content}>
              <Icon
                name="cloud-upload-outline"
                size={100}
                color={theme.secondaryText}
              />
              <Text
                style={[
                  styles.text,
                  { color: theme.secondaryText, fontFamily: theme.fontRegular },
                ]}>
                Supported file types: JPEG, JPG, PNG
              </Text>
            </View>
          ) : (
            <Image
              style={styles.imagePreview}
              source={imgSrc}
              resizeMode="cover"
            />
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  touchable: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: 300,
  },
});

export default ImageUpload;
