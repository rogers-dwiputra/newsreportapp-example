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

import {AuthContext} from '../../Context';

export default class Report extends React.Component {
    constructor(){
      super()
      this.state = {
        isLoading: false,
        news_title: "",
        news_content: "",
        latitude: 0,
        longitude: 0,
        openCamera: false,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
      }
    }
  
    hasLocationPermission = async () => {
      console.log('hasLocationPermission');
      try {
        console.log('request');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Akses Lokasi",
            message:
              "Aktifkan Akses Lokasi Untuk Aplikasi Ini?",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the Location");
          this.setState({ isLoading: true });
          Geolocation.getCurrentPosition(
              (position) => {
                  console.log(position);
                  this.setState({ isLoading: false });
              },
              (error) => {
                  // See error code charts below.
                  console.log(error.code, error.message);
                  this.setState({ isLoading: false });
              },
              { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
          );
          return true;
        } else {
          console.log("Location permission denied");
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
  
    componentDidMount(){
      console.log("componentDidMount");
      this.hasLocationPermission();
    }
  
    submitBerita = () => {
      this.setState({ isLoading: true });
      axios.post('https://basicteknologi.co.id/newsreportapi/index.php/api/news/report', {
        news_title: this.state.news_title,
        news_content: this.state.news_content,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        news_image: this.state.image
      })
      .then((response) => {
        this.setState({ isLoading: false });
        console.log(response);
        if(response.data.status == true){
          this.setState({
            news_title: "",
            news_content: "",
            latitude: 0,
            longitude: 0,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
          });
          this.props.navigation.push('Home')
        }
        else {
          this.setState({ isLoading: false });
          alert(response.data.msg);
        }
      })
      .catch(function (error) {
        this.setState({ isLoading: false });
        console.log(error);
      });
    }
  
    takePicture = async function(camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      //  eslint-disable-next-line
      console.log(data.uri);
      this.setState({ openCamera: false, image: data.uri });
    };
  
    render(){
      if (this.state.isLoading) {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        );
      }
      else {
        if(this.state.openCamera){
          return (
          <View style={styles.container}>
            <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
            >
              {({ camera, status, recordAudioPermissionStatus }) => {
                if (status !== 'READY') return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                      <Text style={{ fontSize: 14 }}> SNAP </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>
          </View>
          );
        }
        else {
          return (
            <View style={{ flex: 1, marginHorizontal: 4 }}>
                <TextInput
                  label='Judul Berita'
                  value={this.state.news_title}
                  onChangeText={news_title => this.setState({ news_title })}
                  style={{ marginTop: 20 }}
                />
                <TextInput
                  label='Narasi Berita'
                  value={this.state.news_content}
                  onChangeText={news_content => this.setState({ news_content })}
                  style={{ marginTop: 8 }}
                  multiline={true}
                  numberOfLines={5}
                />
                <Button style={{ marginTop: 8 }} mode="contained" onPress={() => this.setState({ openCamera: true })}>
                  Open Camera
                </Button>
                <Image
                  style={{
                    marginTop: 8,
                    marginBottom: 4,
                    width: 200,
                    height: 200,
                    resizeMode: 'contain',
                  }}
                  source={{uri: this.state.image }}
                />
                <Button style={{ marginTop: 8 }} mode="contained" onPress={() => this.submitBerita()}>
                  Submit
                </Button>
            </View>
          );
        }
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    capture: {
      flex: 0,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 15,
      paddingHorizontal: 20,
      alignSelf: 'center',
      margin: 20,
    },
  });