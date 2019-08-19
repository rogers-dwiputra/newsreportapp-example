import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  TouchableNativeFeedback,
  Text,
  Toast,
  Image,
  ToastAndroid,
  AlertIOS,
  Platform,
  Alert
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, Title, Paragraph, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

class Submitberita extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      judul_berita: "",
      narasi_berita: "",
      id_user: "",
      isLoading: false
    };

    this._getUserInfo();
  }

  static navigationOptions = {
    title: "Submit Berita"
  };

  _getUserInfo = async () => {
    const id_user = await AsyncStorage.getItem('id_user');
    this.setState({
      id_user: id_user
    });
    this.props.navigation.navigate(id_user ? 'App' : 'Auth');
  };

  apiSubmitBerita(judul_berita, narasi_berita, id_user){
    var formData = new FormData();
    formData.append('judul_berita', judul_berita);
    formData.append('narasi_berita', narasi_berita);
    formData.append('id_user', id_user);
    fetch('https://basicteknologi.co.id/newsreport/index.php/berita/submit/', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.setState({isLoading: false});
      if (Platform.OS === 'ios') {
        AlertIOS.alert('Alert', responseJson.message);
      }
      else {
        ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
      }
    })
    .catch((error) => {
      this.setState({isLoading: false});
      if (Platform.OS === 'ios') {
        AlertIOS.alert('Alert', error.message);
      }
      else {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
      console.log(error.message);
    });
  }

  submitBerita(){
    Alert.alert(
      'Alert',
      'Submit Berita?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async () => this.apiSubmitBerita(this.state.judul_berita, this.state.narasi_berita, this.state.id_user)},
      ],
      {cancelable: false},
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      return (
        <View style={{ flex: 1, marginHorizontal: 4 }}>
            <TextInput
              label='Judul Berita'
              value={this.state.judul_berita}
              onChangeText={judul_berita => this.setState({ judul_berita })}
              style={{ marginTop: 20 }}
            />
            <TextInput
              label='Narasi Berita'
              value={this.state.narasi_berita}
              onChangeText={narasi_berita => this.setState({ narasi_berita })}
              style={{ marginTop: 8 }}
              multiline={true}
              numberOfLines={5}
            />
            <Button style={{ marginTop: 8 }} mode="contained" onPress={() => this.submitBerita()}>
              Submit
            </Button>
        </View>
      );
    }
  }
}

export default Submitberita;