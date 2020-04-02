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

export default class HomeScreen extends React.Component {
    static contextType = AuthContext;
    constructor() {
      super()
      this.state = {
        listBerita: null,
        isLoading: false
      }
    }
  
  apiGetBerita = async () => {
    axios.get('https://basicteknologi.co.id/newsreportapi/index.php/api/news')
    .then((response) => {
      // handle success
      console.log(response.data.data);
      this.setState({listBerita: response.data.data});
      this.setState({ isLoading: false });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
      this.setState({ isLoading: false });
    });
  }
  
  componentDidMount() {
    this.apiGetBerita();
  }
  
    renderRow({ item }) { 
      const { navigation } = this.props;
      return (
        <TouchableNativeFeedback
            onPress={() => this._beritaClick(item)}
            background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}
            onPress={() => navigation.navigate('NewsDetails', {
              newsData: item
            })}
            >
          <Card style={{ marginTop: 16 }}>
            <Card.Content>
              <Title>{item.news_title}</Title>
              <Paragraph>{item.news_content}</Paragraph>
            </Card.Content>
          </Card>
        </TouchableNativeFeedback>
      );   
    }
  
    onRefresh() {
       this.setState({ isLoading: true }, function() { this.apiGetBerita() });
    }
  
    render(){
        const authContext = this.context
        return (
          <View style={{ flex: 1, marginHorizontal: 4 }}>
              <Button mode="contained" style={{ marginTop: 8 }} onPress={() => authContext.signOut()}>Log Out</Button>
              <FlatList
                data={this.state.listBerita}
                renderItem={this.renderRow.bind(this)}
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isLoading}
                keyExtractor={(item, index) => index.toString()}
              />
              <FAB
                style={{ position: 'absolute', margin: 16, right: 0, bottom: 0, }}
                small
                icon="file-document-edit"
                onPress={() => this.props.navigation.navigate('Report')}
              />
          </View>
        );
    }
  }