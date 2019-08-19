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
  Alert,
  Image
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Card, Title, Paragraph, TextInput, Button, IconButton, Colors, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

class Detailberita extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data', ""),
    };
  }

  static navigationOptions = {
    title: 'Detail Berita',
  };

  render() {
    return (
      <View style={{ flex: 1, marginHorizontal: 4, marginTop: 10 }}>
        <Image
          style={{width: 250, height: 250}}
          source={{uri: this.state.data.foto_berita}}
        />
        <Title>{ this.state.data.judul_berita }</Title>
        <Text style={{ marginTop: 4 }}>Dibuat Oleh: { this.state.data.nama_user }</Text>
        <Text style={{ marginTop: 4 }}>Waktu Di Submit: { this.state.data.waktu_publikasi }</Text>
        <Divider style={{ marginTop: 4, marginBottom: 4 }} />
        <Paragraph>{ this.state.data.narasi_berita }</Paragraph>
      </View>
    );
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

export default Detailberita;