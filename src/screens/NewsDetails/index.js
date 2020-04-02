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

export default class NewsDetails extends React.Component {
    constructor() {
      super()
    }
  
    render(){
      const { route } = this.props;
      const { newsData } = route.params;
      console.log(newsData);
      return (
        <View>
          <Text>News Details</Text>
          <Text>{newsData.news_title}</Text>
          <Text>{newsData.news_content}</Text>
          <Text>{newsData.latitude +","+newsData.longitude}</Text>
          <Image
                style={{
                marginTop: 8,
                marginBottom: 4,
                width: 200,
                height: 200,
                resizeMode: 'contain',
                }}
                source={{uri: newsData.news_image }}
            />
        </View>
      );
    }
  }