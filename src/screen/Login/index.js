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
  Platform
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, Title, Paragraph, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isLoading: false,
    };
  }

  static navigationOptions = {
    header: null
  };

  apiLogin(username, password){
    var formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    fetch('https://basicteknologi.co.id/newsreport/index.php/login', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if(responseJson.status == true){
        // Toast.show({ text: fcmToken });
        this.storeData(responseJson.data.id_user, responseJson.data.username, responseJson.data.nama_user);
      }
      else {
        this.setState({isLoading: false});
        if (Platform.OS === 'ios') {
          AlertIOS.alert('Alert', responseJson.message);
        }
        else {
          ToastAndroid.show(responseJson.message, ToastAndroid.LONG);
        }
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
          <View style={{ flex:1, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Image
              style={{width: 200, height: 200, marginBottom: 4}}
              source={require('../../assets/react-native-logo.png')}
            />
            <Text style={{ fontSize: 20 }}>News Reporter App</Text>
          </View>
          <View style={{ flex:1 }}>
            <TextInput
              label='Username'
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
              style={{ marginTop: 8 }}
            />
            <TextInput
              label='Password'
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
              style={{ marginTop: 8 }}
            />
            <Button style={{ marginTop: 8 }} mode="contained" onPress={() => this.apiLogin(this.state.username, this.state.password)}>
              LOGIN
            </Button>
          </View>
        </View>
      );
    }
  }

  storeData = async (id_user, username, nama_user) => {
    try {
      await AsyncStorage.setItem('id_user', id_user);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('nama_user', nama_user);
      await AsyncStorage.setItem('userToken', id_user);
      this.props.navigation.navigate('App');
    } catch (e) {
      // saving error
      console.error(e.message);
    }
  }
}

export default Login;