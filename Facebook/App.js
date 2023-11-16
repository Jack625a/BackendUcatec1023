//Importacion de las dependencias
import { useEffect,useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user,setUser]=useState(null);
  const [request,response,promptAsync]=Facebook.useAuthRequest({
    clientId: "",
  });

  useEffect(()=>{
    if(response&&response.type==="success" && response.authentication){
      (async()=>{
        const userInfoResponse=await fetch(
          `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)` 
        );
        const userInfo=await userInfoResponse.json();
        setUser(userInfo);
      })();
    }
  },[response]);


  const login=async()=>{
    const resultado=await promptAsync();
    if(resultado.type !== "success"){
      alert("Error al iniciar sesion!!!")
      return;
    }
  }


  return (
    <View style={styles.container}>
      {user?(
        <Perfil user={user}/>
      ):(
        <Button
        disabled={!request}
        title='Iniciar sesion con Facebook'
        onPress={login}
        
        />
      )}
    </View>
  );
}


function Perfil({user}){
  return(
    <View style={styles.perfil}>
      <Image
        source={{uri:user.picture.data.url}}
        style={styles.imagen}
      />
      <Text style={styles.nombre}>{user.name}</Text>
      <Text style={styles.nombre}>Id: {user.id}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfil:{
    alignItems:"center",
  },
  imagen:{
    width:150,
    height:150,
    borderRadius:50,

  },
  nombre:{
    fontSize:20,
    fontWeight:"bold",

  },
});
