import React, { useEffect, useState, memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const UiImage = props => {
  const {
    resizeMode = 'cover',
    imageViewStyle,
    style,
    source = null,
    alt = null,
    cond = null,
  } = props;

  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (typeof source === 'string') {
      setImgSrc({ uri: source });
    } else {
      setImgSrc(source);
    }
  }, [source]);

  return (
    <View>
      {cond ? (
        <View style={imageViewStyle}>
          <Image
            style={[styles.defaultImg, style]}
            resizeMode={resizeMode}
            source={imgSrc}
          />
        </View>
      ) : (
        alt
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultImg: {
    width: 50,
    height: 50,
  },
});

export default memo(UiImage, (prevState, newState) => {
  return prevState.source === newState.source;
});
