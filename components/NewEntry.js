import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, Modal, Image, Switch, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import moment from 'moment';
import { Button } from 'react-native-elements';

const db = SQLite.openDatabase('data.db');

export default function NewEntry(props) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState(moment(new Date()).format("DD-MM-YYYY hh:mm a"));

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [showLocation, setShowLocation] = useState(false);

  const [weather, setWeather] = useState('');
  const [icon, setIcon] = useState('');
  const [temp, setTemp] = useState('');
  const [showWeather, setShowWeather] = useState(false);

  const [cameraModal, setCameraModal] = useState(false);
  const [image, setImage] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(null)

  const camera = useRef(null);

  navigationOptions = {
    title: 'New Entry',
  };

  useEffect(() => {
    askCameraPermission();
    getLocation();
  }, []);

  askCameraPermission = async () => {
    let { status } = await Permissions.askAsync(Permissions.CAMERA);
    setPermissionGranted( status == 'granted');
  }

  getLocation = async() => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        Alert.alert('No permission to access location');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
  }

  const getAddress = () => {
    const url = 'http://www.mapquestapi.com/geocoding/v1/address?key=RxB6wLlS6bPjlSw6LVAhNKhJoRY84yTD&location=' + latitude + ',' + longitude
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      setAddress(responseJson.results[0].locations[0].street);
      setCity(responseJson.results[0].locations[0].adminArea5);
      //setLatitude(responseJson.results[0].locations[0].latLng.lat);
      //setLongitude(responseJson.results[0].locations[0].latLng.lng);
    });
  }

  const getWeather = () => {
    const url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric&appid=3fe10118426166722c3f50c85e4ef25a'
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      setWeather(responseJson.weather[0].main);
      setTemp(responseJson.main.temp)
      setIcon('http://openweathermap.org/img/wn/' + responseJson.weather[0].icon + '.png')
    });
  }

  const addLocation = () => {
    setShowLocation(!showLocation);
    if (showLocation === true) {
      setAddress('');
      setCity('');
    } else {
      getAddress();
    }
  }

  const addWeather = () => {
    setShowWeather(!showWeather);
    if (showWeather === true) {
      setWeather('');
      setTemp('');
      setIcon('');
    } else {
      getWeather();
    }
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
        tx.executeSql('insert into data (title, text, date, image, address, city, weather, icon, temp) values (?, ?, ?, ?, ?, ?, ?, ?, ?);', [title, text, date, image, address, city, weather, icon, temp]);
      }, console.log("An error occured..."), updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from data;', [], (_, { rows }) =>
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
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text>Include location? {address} {city}</Text>
        <Switch onValueChange={addLocation} value={showLocation} />
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text>Include weather? {weather} {temp}</Text>
        <Image style={{width: 50, height: 50}} source={{uri: icon}} />
        <Switch onValueChange={addWeather} value={showWeather} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
          <Button title="TAKE A PICTURE" raised={true} buttonStyle={styles.picturebutton} titleStyle={styles.picturebuttontitle} onPress={() => toggleCameraModal(true)} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
          <Button title="ADD ENTRY" raised={true} buttonStyle={styles.addentrybutton} titleStyle={styles.addentrybuttontitle} onPress={() => addEntry()} />
      </View>

      <Modal visible={cameraModal} onRequestClose={() => setCameraModal(!cameraModal)}>
        <View style={{flex: 1, backgroundColor: '#4D4D4D'}}>
        { permissionGranted ?
          (
          <View style={{flex: 1}}>
            <View style={{flex: 5}}>
              <Camera style={{flex: 1}} ref={camera}/>
            </View>
            <View style={{flex: 1, alignItems: 'center', paddingTop: 10}}>
              <Button title="CAPTURE" buttonStyle={styles.picturebutton} titleStyle={styles.picturebuttontitle} onPress={snap}/>
            </View>
            <View style={{flex: 4, alignItems: 'stretch', backgroundColor: "#CCCCCC"}}>
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
    backgroundColor: '#CCCCCC',
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
  },
  addentrybutton: {
    backgroundColor: '#00BF00'
  },
  addentrybuttontitle: {
    color: '#00FF00'
  },
  picturebutton: {
    backgroundColor: '#367880'
  },
  picturebuttontitle: {
    color: '#6CF1FF'
  }
});