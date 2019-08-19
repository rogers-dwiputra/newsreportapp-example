import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  TouchableNativeFeedback,
  Text,
  Toast
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, Title, Paragraph, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

import Login from "./src/screen/Login/";
import HomeScreen from "./src/screen/Home/";
import Detailberita from "./src/screen/Detailberita/";
import Submitberita from "./src/screen/Submitberita/";

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({ Home: HomeScreen, Detailberita: Detailberita, Submitberita: Submitberita });
const AuthStack = createStackNavigator({ Login: Login });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));