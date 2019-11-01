import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function Home(props) {
    navigationOptions = {
        title: 'Home',
    };

    const {navigate} = props.navigation;

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text>Welcome back!</Text>
      </View>
      <View style={{flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
        <Button title="New Entry" onPress={() => navigate('NewEntry')} />
        <Button title="Old Entries" />
      </View>
    </View>
  );
}

Home.navigationOptions = ({navigate}) => ({title: 'Home'});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});