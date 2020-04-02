import 'react-native-gesture-handler';
import * as React from 'react';
import { Text, View, Image, FlatList, TouchableNativeFeedback, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Provider as PaperProvider, Card, Title, Paragraph, TextInput, Button, FAB, ActivityIndicator } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';

export default function SplashScreen() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }