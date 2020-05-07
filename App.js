import 'react-native-gesture-handler';
import * as React from 'react';
import { Text, View, Image, FlatList, TouchableNativeFeedback, PermissionsAndroid, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Provider as PaperProvider, Card, Title, Paragraph, TextInput, Button, FAB, ActivityIndicator } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { RNCamera } from 'react-native-camera';

import SignInScreen from './src/screens/SignIn';
import HomeScreen from './src/screens/Home';
import Report from './src/screens/Report';
import NewsDetails from './src/screens/NewsDetails';
import SplashScreen from './src/screens/SplashScreen';

import {AuthContext} from './src/Context';

const Stack = createStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          // try {
          //   console.log(action.token);
          //   userToken = await AsyncStorage.setItem('userToken', action.token);
          // } catch (e) {
          //   // Restoring token failed
          //   console.log(e);
          // }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          // try {
          //   userToken = await AsyncStorage.setItem('userToken', null);
          // } catch (e) {
          //   // Restoring token failed
          // }
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      // console.log(userToken);
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        console.log(username+' '+password);
        axios.post('https://basicteknologi.co.id/newsreportapi/index.php/api/login', {
          username: username,
          password: password
        })
        .then(async function (response) {
          console.log(response);
          if(response.data.status == true){
            try {
              userToken = await AsyncStorage.setItem('userToken', response.data.data.id_user);
              dispatch({ type: 'SIGN_IN', token: response.data.data.id_user });
            } catch (e) {
              console.log(e);
            }
          }
          else {
            alert(response.data.msg);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      signOut: async () => {
        try {
          console.log('signout');
          userToken = await AsyncStorage.setItem('userToken', '');
          dispatch({ type: 'SIGN_OUT' })
        } catch (e) {
          console.log(e);
        }
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <PaperProvider>
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
            // When logging out, a pop animation feels intuitive
                headerShown: false,
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <>
            <Stack.Screen name="Home" 
            component={HomeScreen} 
            options={{
              headerRight: () => (
                <Button
                  onPress={() => { Alert.alert(
                    "Alert",
                    "Logout Akun?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                      },
                      { text: "OK", onPress: () => authContext.signOut() }
                    ],
                    { cancelable: false }
                  ) }}
                  icon="power"
                  color="#3a3a3a"
                />
              ),
            }}
            />
            <Stack.Screen name="NewsDetails" component={NewsDetails} />
            <Stack.Screen name="Report" component={Report} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    </PaperProvider>
  );
}
