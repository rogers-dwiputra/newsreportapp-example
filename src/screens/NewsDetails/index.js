import 'react-native-gesture-handler';
import * as React from 'react';
import { ScrollView, Text, View, Image, FlatList, TouchableNativeFeedback, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Provider as PaperProvider, Card, Title, Paragraph, TextInput, Button, FAB, ActivityIndicator } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';
import MapView, { Marker } from 'react-native-maps';

export default class NewsDetails extends React.Component {
    constructor() {
      super()
    }
  
    render(){
      const { route } = this.props;
      const { newsData } = route.params;
      // console.log(newsData);
      return (
        <ScrollView style={{ flex: 1, marginBottom: 8 }}> 
          <Card style={{marginBottom: 8}}>
            <Card.Content>
              <Image
                  style={{
                  marginBottom: 4,
                  width: '100%',
                  height: 200,
                  resizeMode: 'contain',
                  }}
                  source={{uri: 'data:image/png;base64,'+newsData.news_image }}
              />
              <Title>{newsData.news_title}</Title>
              <Paragraph>{newsData.news_content}</Paragraph>
              <Text>{newsData.latitude +","+newsData.longitude}</Text>
            </Card.Content>
          </Card>
          <MapView
            style={{ width: '100%', height: 250 }}
            initialRegion={{
              latitude: parseFloat(newsData.latitude),
              longitude: parseFloat(newsData.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{latitude: parseFloat(newsData.latitude),
                longitude: parseFloat(newsData.longitude)}}
              title="Lokasi Laporan"
              description="asd"
            />
          </MapView>
        </ScrollView>
      );
    }
  }