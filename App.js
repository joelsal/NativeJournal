import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/Home';
import NewEntry from './components/NewEntry';

const MyApp = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Native Journal",
      headerTitleStyle: {
        color: '#357F82'
      },
      headerStyle: {
        backgroundColor: '#7ACACF'
      }
    }
  },
  NewEntry: {
    screen: NewEntry,
    navigationOptions: {
      title: "Add a new entry"
    }
  },
});

const AppContainer = createAppContainer(MyApp);

export default function App() {
  return (
    <AppContainer />
  );
}


