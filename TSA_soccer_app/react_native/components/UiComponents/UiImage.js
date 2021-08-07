import React from 'react';
import { View, Image } from 'react-native';
import Base64 from 'base-64';

const UiImage = props => {
  const { resizeMode, imageViewStyle, style, source = null } = props;

  return (
    <View>
      {source ? (
        <View style={imageViewStyle}>
          <Image
            style={style}
            resizeMode={resizeMode}
            source={{
              uri: source,
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default UiImage;
