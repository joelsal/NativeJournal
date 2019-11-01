import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './components/Home';
import NewEntry from './components/NewEntry';

const MyApp = createStackNavigator({
  Home: Home,
  NewEntry: NewEntry,
});

const AppContainer = createAppContainer(MyApp);

export default function App() {
  return (
    <AppContainer />
  );
}


