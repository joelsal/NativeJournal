import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Modal, Dimensions, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import { Button } from 'react-native-elements';

const db = SQLite.openDatabase('data.db');

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
        tx.executeSql('create table if not exists data (id integer primary key not null, title text, text text, date text, image text, address text, city text, weather text, icon text, temp text);');
      });
      return() => {
        journalRefresh.remove();
      }
    }, []);

    const deleteEntry = (id) => {
      Alert.alert(
        'Warning',
        'Are you sure you want to delete this entry?',
        [
          {text: 'YES', onPress: () => db.transaction(tx => {
                                         tx.executeSql('delete from data where id = ?;', [id]);
                                       }, null, updateList
                                       )},
          {text: 'NO', onPress: () => console.log('NO was pressed')},
        ]
      )
    }

    const updateList = () => {
      db.transaction(tx => {
        tx.executeSql('select * from data;', [], (_, { rows }) =>
          setData(rows._array)
        );
      });
    }

    const toggleImageModal = (id) => {
      db.transaction(tx => {
        tx.executeSql('select * from data where id = ?;', [id], (_, { rows }) => {
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
            width: "95%",
            backgroundColor: "#4D4D4D",
            marginLeft: "10%"
          }}
        />
      )
    }

  return (
    <View style={styles.container}>
      <View style={styles.newentrybuttonview}>
        <Button title="ADD A NEW ENTRY" raised={true} buttonStyle={styles.newentrybutton} titleStyle={styles.newentrybuttontitle} onPress={() => navigate('NewEntry')} />
      </View>
      <View style={{flex: 8, width: "95%"}}>
        <FlatList
          inverted={true}
          keyExtractor={item => item.id.toString()} 
          renderItem={({item}) => <View style={styles.listcontainer}>
                                    <TouchableWithoutFeedback onLongPress={() => deleteEntry(item.id)}>
                                      <Text style={styles.listtitle}>{item.title}</Text>
                                      { item.text != "" ?
                                        (
                                        <Text style={styles.listtext}>{item.text}</Text>
                                        ) : (
                                          <View></View>
                                        )}
                                      <Text style={styles.listdate}>{item.date}</Text>
                                      { item.image != "" ?
                                        (
                                        <TouchableOpacity onPress={() => toggleImageModal(item.id)}>
                                          <Image style={styles.listimage} source={{uri: item.image}} />
                                        </TouchableOpacity>
                                        ) : (
                                          <View></View>
                                        )}
                                      { item.address != "" || item.city != "" ?
                                        (
                                        <Text style={styles.listaddress}>{item.address}, {item.city}</Text>
                                        ) : (
                                          <View></View>
                                        )}
                                      { item.weather != "" || item.temp != "" ?
                                        (
                                        <Text style={styles.listweather}>{item.weather} {item.temp}°C</Text>
                                        ) : (
                                          <View></View>
                                        )}
                                      { item.icon != "" ?
                                        (
                                        <Image style={styles.listicon} source={{uri: item.icon}}/>
                                        ) : (
                                          <View></View>
                                        )}
                                    </TouchableWithoutFeedback>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D4D4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newentrybuttonview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  newentrybutton: {
    backgroundColor: '#00BF00'
  },
  newentrybuttontitle: {
    color: '#00FF00'
  },
  listcontainer: {
    backgroundColor: '#CCCCCC',
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