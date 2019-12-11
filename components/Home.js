import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image, Modal, Dimensions } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';

const db = SQLite.openDatabase('wet.db');

export default function Home(props) {
    navigationOptions = {
        title: 'Home',
    };

    const {navigate} = props.navigation;
    const [data, setData] = useState([]);

    const [imageModal, setImageModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const journalRefresh = props.navigation.addListener('willFocus', () => {
      updateList();
    });

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('create table if not exists wet (id integer primary key not null, title text, text text, date text, image text, address text, weather text, icon text);');
      });
      return() => {
        journalRefresh.remove();
      }
    }, []);

    const updateList = () => {
      db.transaction(tx => {
        tx.executeSql('select * from wet;', [], (_, { rows }) =>
          setData(rows._array)
        );
      });
    }

    const toggleImageModal = (id) => {
      db.transaction(tx => {
        tx.executeSql('select * from wet where id = ?;', [id], (__, { rows }) => {
          const picture = rows._array[0].image;
          setModalImage(picture);
        })
      })
      setImageModal(!imageModal)
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
                                    <TouchableOpacity onPress={() => toggleImageModal(item.id)}>
                                      <Image style={styles.listimage} source={{uri: item.image}} />
                                    </TouchableOpacity>
                                    <Text style={styles.listaddress}>{item.address}</Text>
                                    <Text style={styles.listweather}>{item.weather}</Text>
                                    <Image style={styles.listicon} source={{uri: item.icon}}/>
                                  </View>}
          data={data}
          ItemSeparatorComponent={listSeparator}
        />
      </View>

      <Modal visible={imageModal} onRequestClose={() => setImageModal(!imageModal)}>
        <View style={{backgroundColor: '#000000'}}>
          <ImageZoom cropWidth={Dimensions.get('window').width}
                     cropHeight={Dimensions.get('window').height}
                     imageWidth={Dimensions.get('window').width}
                     imageHeight={Dimensions.get('window').height}>
            <Image style={styles.modalImage} source={{uri: modalImage}} />
          </ImageZoom>
        </View>
      </Modal>
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
  },
  listweather: {
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 3
  },
  listicon: {
    width: 50,
    height: 50
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain'
  }
});