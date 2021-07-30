import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from 'react-native';
import { UiInput, UiButton, UiIconButton } from '../components/_components';

const LoginScreen = ({ navigation }) => {
  return (
    <KeyboardAvoidingView behavior="position">
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
        }}
        style={styles.container}>
        <View style={styles.closeButton}>
          <UiIconButton
            icon="close-outline"
            color="#E41B23"
            backgroundColor="#EAEAEA"
            size={24}
            darkBg={false}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.imgContainer}>
          <Image
            style={styles.headerImg}
            source={require('../assets/img/CTSA_Logo.png')}
            resizeMode="cover"
          />
        </View>
        <View style={styles.heading}>
          <Text style={styles.headingTitle}>Welcome to CTSA!</Text>
          <Text style={styles.headingSubtitle}>
            Join our community of over 100 players in the GTA
          </Text>
        </View>
        <View style={styles.body}>
          <UiInput
            contentType="username"
            placeholder="Username"
            style={styles.marginBottom}
          />
          <UiInput
            contentType="password"
            placeholder="Password"
            icon={{ name: 'eye-outline', altName: 'eye-off-outline', size: 26 }}
          />
          <UiButton
            label="Login"
            width="100%"
            borderRadius={8}
            style={styles.button}
          />
        </View>
        <View style={styles.footer} />
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 30,
    top: 40,
  },
  imgContainer: {
    width: 120,
    height: 120,
    marginTop: 60,
    marginBottom: 20,
  },
  headerImg: {
    width: 120,
    height: 120,
  },
  heading: {
    alignItems: 'center',
    width: '80%',
  },
  headingTitle: {
    fontFamily: 'Roboto-Medium',
    color: 'black',
    fontSize: 24,
    marginBottom: 10,
  },
  headingSubtitle: {
    fontFamily: 'Roboto-Regular',
    color: 'rgb(175,176,185)',
    fontSize: 16,
    textAlign: 'center',
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    width: '100%',
  },
  footer: {},
  button: {
    marginTop: 20,
  },
  marginBottom: {
    marginBottom: 10,
  },
});

export default LoginScreen;
