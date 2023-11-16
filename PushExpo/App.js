import { useState,useEffect,useRef } from 'react';
import { StyleSheet, Text, View, Button,Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';



//Funcion para activar las notificaciones 
Notifications.setNotificationHandler({
  handleNotification:async ()=>({
    shouldShowAlert:true,
    shouldPlaySound:true,
    shouldSetBadge:false,
  }),
});


export default function App() {
  const[expoPushToken,setExpoPushToken]=useState("");
  const[notificacion,setNotificacion]=useState(false);
  const notificacionListener=useRef();
  const responseListener=useRef();


  useEffect(()=>{
    registerForPushNotificationsAsync().then(token=>setExpoPushToken(token));
    notificacionListener.current=Notifications.addNotificationReceivedListener(notificacion=>{
      setNotificacion(notificacion);
    });


  responseListener.current=Notifications.addNotificationReceivedListener(response=>{
    console.log(response);
  });

  return()=>{
    Notifications.removeNotificationSubscription(notificacionListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };

},[]);


return (
    <View>
      <Text>Push Token:{expoPushToken} </Text>
    </View>
  );

};

async function registerForPushNotificationsAsync(){
  let token;
  if(Device.isDevice){
    const {status:existeStatus}=await Notifications.getPermissionsAsync();
    let finalStatus=existeStatus;
    if(existeStatus!=='granted'){
      const {status}=await Notifications.requestPermissionsAsync();
      finalStatus=status;
    }
    if(finalStatus!=='granted'){
      alert("Error al conectar con el push Token");
      return;
    }
    token=(await Notifications.getExpoPushTokenAsync()).data;

  }else{
    Alert("Error al registrar el dispositivo")
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    });
    }
   

return token;
}

