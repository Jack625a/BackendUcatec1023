import React,{useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button,TouchableOpacity, Alert} from 'react-native';
import MapView,{Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [ubicacion,setUbicacion]=useState(null);
  const [marcadores,setMarcadores]=useState([]);
  const [marcadorSeleccionado,setMarcadorSeleccionado]=useState(null);

  
//Hook para la ubicacion
useEffect(()=>{
  obtenerUbicacion();
},[]);


//Funcion para obtener la ubicacion del sensor
const obtenerUbicacion=async()=>{
  let { status }=await Location.requestForegroundPermissionsAsync();
  if(status!=='granted'){
    console.log("Permisos Denegados")
    alert("Permiso Denegado para acceso a la ubicación")
    return;
  }
  let location=await Location.getCurrentPositionAsync({});
  const ubicacionActual={
    latitude:location.coords.latitude,
    longitude:location.coords.longitude,
  };
  setUbicacion(ubicacionActual);
};

const guardarUbicacion=()=>{
  if(ubicacion){
    console.log('Ubicacion:',ubicacion)
    //let latitudSensor=ubicacion?.latitude;
    const {latitude,longitude}=ubicacion;
    alert('Latitud:',latitude, "Longitud",longitude)

  }else{
    alert("error al obtener la ubicacion")
  }
};

return (   
     <View style={styles.container}>{ubicacion &&(
      <MapView
        style={styles.mapa}
        initialRegion={{
          ...ubicacion,
          latitudeDelta:0.01,
          longitudeDelta:0.03,
        }}
        >
        
        </MapView>
     )}
    <Button title='Obtener ubicacion' onPress={obtenerUbicacion}/>
     
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
  mapa:{
    ...StyleSheet.absoluteFillObject,
  },
  informacion:{
    position:'absolute',
    backgroundColor:'#fff',
    padding:20,
    justifyContent:'space-between',
    alignItems:'center',
  },
});
