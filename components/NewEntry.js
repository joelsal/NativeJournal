import React, { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';

export default function NewEntry(props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  navigationOptions = {
    title: 'New Entry',
  };


  return (
    <View style={styles.container}>
      <View style={{flex: 1, paddingTop: 20}}>
        <TextInput style={{width: 200, borderColor: 'gray', borderWidth: 1}} onChangeText={(title) => setTitle(title)} value={title} />
      </View>
      <View style={{flex: 4}}>
        <TextInput style={{width: 200, borderColor: 'gray', borderWidth: 1}} onChangeText={(text) => setText(text)} value={text} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
          <Button title="Add Entry" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});