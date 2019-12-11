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
        color: '#000000'
      },
      headerStyle: {
        backgroundColor: '#CCCCCC'
      }
    }
  },
  NewEntry: {
    screen: NewEntry,
    navigationOptions: {
      title: "Add a new entry",
      headerTitleStyle: {
        color: '#000000'
      },
      headerStyle: {
        backgroundColor: '#CCCCCC'
      }
    }
  },
});

const AppContainer = createAppContainer(MyApp);

export default function App() {
  return (
    <AppContainer />
  );
}


