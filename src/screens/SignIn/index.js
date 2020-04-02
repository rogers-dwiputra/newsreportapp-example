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

export default class SignInScreen extends React.Component {
    static contextType = AuthContext;
    constructor(){
      super()
      this.state = {
        username: '',
        password: ''
      }
    }
  
    componentDidMount(){
      
    }
  
    render(){
      const authContext = this.context
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
          <Button style={{ marginTop: 8 }} mode="contained" onPress={() => authContext.signIn(this.state.username, this.state.password)}>
            LOGIN
          </Button>
        </View>
      </View>
      );
    }
  }