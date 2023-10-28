//Importacion de las dependencias
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button,Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();


export default function App() {
    const [userInfo, setUserInfo]=React.useState(null);
    const [request,response,promptAsyn]=Google.useAuthRequest({
      iosClientId:"",
      androidClientId: "",
    });

const obtenerSesionUser=async()=>{
  const data=await AsyncStorage.getItem("@user");
  if (!data) return null;
  return JSON.parse(data);
}


//Funcion asincrona para las credenciales de la sesion
const obtenerUserInfo= async(token)=>{
  if(!token)return;
  try{
    const response=await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers:{
          Autorization:`Bearer ${token}`,
        }
      }
    );
    const user=await response.json();
    await AsyncStorage.setItem("@user",JSON.stringify(user));
    setUserInfo(user);
  }catch(e){
    console.log(e);
  }
};

//hook para el signIn

React.useEffect(()=>{
  iniciarSesionGoogle();
}, [response]);

async function iniciarSesionGoogle(){
  const user= await obtenerSesionUser();
  if(!user){
    if(response?.type==="success"){
      obtenerUserInfo(response.authentication.accessToken);
    }
    else{
      setUserInfo(user);
    }
  }
}

  return (
    <View style={styles.container}>
      {!userInfo?(
        <Button
          title='Iniciar Sesion con Google'
          disabled={!request}
          onPress={()=>{
            promptAsyn();
          }}
        />
      ):(
        <View style={styles.caja}>
          {userInfo?.picture && (
            <Image 
              source={{uri:userInfo?.picture}}
              style={styles.image}
            />
          )}
          <Text style={styles.text}>
            Email:{userInfo.email} 
          </Text>
          <Text style={styles.text}>
            Nombre: {userInfo.name}
          </Text>
        </View>
      )

      }

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
  text:{
    fontSize:18,
  },
  image:{
    width:150,
    height:150,
    borderRadius:50,
  },
  caja:{
    padding:15,
    borderRadius:20,
  }
});
