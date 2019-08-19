import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  FlatList,
  TouchableNativeFeedback,
  Text,
  Toast,
  Alert
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, Title, Paragraph, TextInput, Button, IconButton, Colors, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { listBerita: null, isLoading: false };
    this._beritaClick = this._beritaClick.bind(this);
  }

  _logout = async () => {
    Alert.alert(
      'Alert',
      'Logout Akun?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: async () => {
          try {
            await AsyncStorage.clear();
            this.props.navigation.navigate('Auth');
          } catch (e) {
            Alert.alert(e.message);
          }
        }},
      ],
      {cancelable: false},
    );
  }

  static navigationOptions = ({ navigation }) => {
    return {
    title: "News Report",
    headerRight: (
      <IconButton
        icon="power-settings-new"
        color={Colors.red500}
        size={20}
        onPress={navigation.getParam('logout')}
      />
    ),
  }};

  _beritaClick(data) {
    this.props.navigation.navigate('Detailberita', {data: data});
  }

  async apiGetBerita() {
      try {
        let response = await fetch('https://basicteknologi.co.id/newsreport/index.php/berita/get');
        let responseJson = await response.json();
        this.setState({listBerita: responseJson.data});
        this.setState({ isLoading: false });
      } catch (error) {
        console.error(error);
        this.setState({ isLoading: false });
      }
    }

  componentDidMount() {
    this.props.navigation.setParams({ logout: this._logout });
    this.apiGetBerita();
  }

  renderRow({ item }) { 
    return (
      <TouchableNativeFeedback
          onPress={() => this._beritaClick(item)}
          background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
        <Card style={{ marginTop: 16 }}>
          <Card.Cover source={{ uri: item.foto_berita }} />
          <Card.Content>
            <Title>{item.judul_berita}</Title>
            <Paragraph>{item.narasi_berita}</Paragraph>
          </Card.Content>
        </Card>
      </TouchableNativeFeedback>
    );   
  }

  onRefresh() {
     this.setState({ isLoading: true }, function() { this.apiGetBerita() });
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
              icon="add"
              onPress={() => this.props.navigation.navigate('Submitberita')}
            />
        </View>
      );
    }
  }
}

export default HomeScreen;