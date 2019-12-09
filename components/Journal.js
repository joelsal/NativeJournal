import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

export default function Journal(props) {
  navigationOptions = {
    title: 'Journal',
  };

  //const { params } = props.navigation.state;

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20}}>JOURNAL</Text>
      <FlatList 
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => <View style={styles.listcontainer}>
                                  <Text style={{fontSize: 18}}>{item.title}</Text>
                                  <Text style={{fontSize: 18}}>{item.text}</Text>
                                </View>}
        data={items}
        ItemSeparatorComponent={listSeparator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    listcontainer: {
      flex: 4,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 30,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });