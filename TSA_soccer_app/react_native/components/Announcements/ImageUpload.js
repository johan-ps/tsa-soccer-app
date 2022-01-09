import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Image,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { UiModal } from '../_components';

const cameraConfig = {
  cropping: true,
  width: 500,
  height: 500,
  includeExif: true,
  mediaType: 'photo',
};
const imageConfig = {
  width: 300,
  height: 300,
  cropping: true,
  includeBase64: true,
  includeExif: true,
};

const ImageUpload = props => {
  const { imgUrl } = props;
  const theme = useSelector(state => state.theme.colors);
  const [imgPickerModalVisible, setImgPickerModalVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (typeof imgUrl === 'string') {
      setImgSrc({ uri: imgUrl });
    } else {
      setImgSrc(imgUrl);
    }
  }, [imgUrl]);

  const handleImageSelect = img => {
    if (props.onChange) {
      const data = {
        uri: `${img.path}`,
        width: img.width,
        height: img.height,
        type: img.mime,
        name: `profileImg.${img.mime.split('/')[1]}`,
      };
      props.onChange(data);
    }
  };

  const imagePickerHandler = () => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        ImagePicker.openPicker(imageConfig)
          .then(handleImageSelect)
          .catch(e => {
            console.log(e);
          });
      }, 400);
    } else {
      ImagePicker.openPicker(imageConfig)
        .then(handleImageSelect)
        .catch(e => {
          console.log(e);
        });
    }
  };

  const cameraHandler = () => {
    if (Platform.OS === 'ios') {
      setTimeout(() => {
        ImagePicker.openCamera(cameraConfig)
          .then(handleImageSelect)
          .catch(e => {
            console.log(e);
          });
      }, 400);
    } else {
      ImagePicker.openCamera(cameraConfig)
        .then(handleImageSelect)
        .catch(e => {
          console.log(e);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableNativeFeedback
        onPress={() => {
          setImgPickerModalVisible(true);
        }}
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
      <UiModal
        primaryLabel="Camera"
        secondaryLabel="Library"
        visible={imgPickerModalVisible}
        title="Upload Image"
        content={'How would you like to upload your image?'}
        primaryBtnHandler={cameraHandler}
        secondaryBtnHandler={imagePickerHandler}
        onCloseHandler={() => {
          setImgPickerModalVisible(false);
        }}
        icon="aperture-outline"
        closeable={true}
        onClose={() => {
          setImgPickerModalVisible(false);
        }}
      />
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
