import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image } from 'react-native';
//import { ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('ask.db');

export default function Home(props) {
    navigationOptions = {
        title: 'Home',
    };

    const {navigate} = props.navigation;
    const [data, setData] = useState([]);

    const journalRefresh = props.navigation.addListener('willFocus', () => {
      updateList();
    });

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('create table if not exists ask (id integer primary key not null, title text, text text, date text, image text, address text);');
      });
      return() => {
        journalRefresh.remove();
      }
    }, []);

    const updateList = () => {
      db.transaction(tx => {
        tx.executeSql('select * from ask;', [], (_, { rows }) =>
          setData(rows._array)
        );
      });
    }

    const listSeparator = () => {
      return (
        <View
          style={{
            height: 5,
            width: "80%",
            backgroundColor: "#fff",
            marginLeft: "10%"
          }}
        />
      )
    }

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text>Welcome back!</Text>
      </View>
      <View style={{flex: 1}}>
        <Button title="New Entry" onPress={() => navigate('NewEntry')} />
      </View>
      <View style={{flex: 8, width: "95%"}}>
        <Text style={{fontSize: 20}}>JOURNAL</Text>
        <FlatList
          inverted={true}
          keyExtractor={item => item.id.toString()} 
          renderItem={({item}) => <View style={styles.listcontainer}>
                                    <Text style={styles.listtitle}>{item.title}</Text>
                                    <Text style={styles.listtext}>{item.text}</Text>
                                    <Text style={styles.listdate}>{item.date}</Text>
                                    <Image style={styles.listimage} source={{uri: item.image}} />
                                    <Text style={styles.listaddress}>{item.address}</Text>
                                  </View>}
          data={data}
          ItemSeparatorComponent={listSeparator}
        />
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
  listcontainer: {
    backgroundColor: '#ECA6FF',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  listtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 3
  },
  listtext: {
    fontSize: 18,
    paddingLeft: 3
  },
  listdate: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 3
  },
  listaddress: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 3
  },
  listimage: {
    width: 50,
    height: 100,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#003067'
  }
});