import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, TextInput, Text, Modal, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import moment from 'moment';

const db = SQLite.openDatabase('test.db');

export default function NewEntry(props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(moment(new Date()).format("DD-MM-YYYY hh:mm a"));
  const [cameraModal, setCameraModal] = useState(false);
  const [image, setImage] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(null)

  const camera = useRef(null);

  navigationOptions = {
    title: 'New Entry',
  };

  useEffect(() => {
    askCameraPermission();
  }, []);

  askCameraPermission = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    setPermissionGranted( status == 'granted');
  }

  const snap = async () => {
    if (camera) {
      let photo = await camera.current.takePictureAsync({base64: false});
      setImage(photo.uri);
      //setCameraModal(!cameraModal);
      //console.log(image)
    }
    //console.log(image)
  };

  const addEntry = () => {
      db.transaction(tx => {
        tx.executeSql('insert into test (title, text, date, image) values (?, ?, ?, ?);', [title, text, date, image]);
      }, console.log("An error occured..."), updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from test;', [], (_, { rows }) =>
        console.log(rows._array)
      );
    });
    navigate('Home')
  }

  const toggleCameraModal = (visible) => {
    setCameraModal(visible);
  }

  const {navigate} = props.navigation;

  return (
    <View style={styles.container}>
      <View style={{flex: 1, paddingTop: 20}}>
        <Text>TITLE</Text>
        <TextInput style={styles.titletext} onChangeText={(title) => setTitle(title)} value={title} />
      </View>
      <View style={{flex: 4}}>
        <Text>TEXT</Text>
        <TextInput style={styles.texttext} multiline={true} numberOfLines={10} textAlignVertical={'top'} onChangeText={(text) => setText(text)} value={text} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
          <Button title="TAKE A PICTURE" onPress={() => toggleCameraModal(true)} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
          <Button title="Add Entry" onPress={() => addEntry()} />
      </View>

      <Modal visible={cameraModal} onRequestClose={() => setCameraModal(!cameraModal)}>
        <View style={{flex: 1}}>
        { permissionGranted ?
          (
          <View style={{flex: 1}}>
            <View style={{flex: 5}}>
              <Camera style={{flex: 1}} ref={camera}/>
            </View>
            <View style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
              <Button title="Take a picture!" onPress={snap}/>
            </View>
            <View style={{flex: 4, alignItems: 'stretch', backgroundColor: "#FFC7D5"}}>
              <Image style={styles.previewimage} source={{uri: image}}/>
            </View>
          </View>
          ) : (
            <Text>NativeJournal has no access to camera!</Text>
          )}
        </View>
      </Modal>

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
  titletext: {
    width: 300,
    borderColor: 'gray',
    borderWidth: 1
  },
  texttext: {
    width: 300, 
    borderColor: 'gray',
    borderWidth: 1
  },
  previewimage: {
    width: "100%",
    height: "100%",
    paddingBottom: 20,
  }
});