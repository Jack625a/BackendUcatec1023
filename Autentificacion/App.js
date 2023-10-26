//Importaciones
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity,TextInput,Button,Image, Alert } from 'react-native';
import {BlurView} from 'expo-blur';
import {getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
import {firebaseConfig} from './firebase-config';
import { initializeApp } from 'firebase/app';
import { useState } from 'react';

//IMAGEN DE FONDO
const uri='https://i.pinimg.com/236x/81/72/f3/8172f32cc85e02fe8c7cec5f5fd176fb.jpg';

//Funcion para Pantalla Inicio
function PantallaIncio(){
  return(
    <View style={{flex:1, alignItems:'center',justifyContent:'center'}}>
      <Text>Pantalla Incio</Text>
    </View>
  )
}

//Funcion para Pantalla Login
function PantallaLogin(){
  const [email,setEmail]=React.useState('')
  const [password,setPassword]=React.useState('')
  const app=initializeApp(firebaseConfig);
  const auth=getAuth(app);

  //2 funciones para crear cuenta y iniciar sesion
  const CrearCuenta=()=>{
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      console.log('Cuenta creada correctamente')
      const user=userCredential.user;
      console.log(user);
    })
    .catch(error=>{
      console.log(error)
      Alert.alert(error.mesage)
    })
  }

  const InicioSesion=()=>{
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
      console.log('Inicio de sesion correcto.... Bienvenido.')
      const user=userCredential.user;
      console.log(user)
    })
    .catch(error=>{
      console.log(error)
    })
  }


  return (
    //Componentes que interectua el usuario
    <View style={styles.container}>
      <Image
        source={{uri}} 
        style={[styles.imagen, StyleSheet.absosutefill]}
      />
      <ScrollView
        contentContainerStyle={{
          width:'100%',
          height:'100%',
          alignItems:'center',
          justifyContent:'center',
          flex:1,
        }}>

          <BlurView intensity={80}>
            <View style={styles.login}>
              <View>
                <Text style={{fontSize:16, fontWeight:'300',color:'#fff'}}>
                    Correo
                </Text>
                <TextInput onChangeText={(text)=>setEmail(text)} style={styles.input} placeholder='correo@ejemplo.com'/>
                <Text style={{fontSize:16, fontWeight:'300',color:'#fff'}}>
                    Contraseña
                </Text>
                <TextInput  onChangeText={(text)=>setPassword(text)} style={styles.input} placeholder='contraseña' secureTextEntry={true}/>
              </View>
              <View>
                <TouchableOpacity onPress={InicioSesion} style={styles.boton}>
                  <Text style={{fontSize:16, fontWeight:'300',color:'#fff'}}>Iniciar Sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={CrearCuenta} style={styles.boton}>
                  <Text style={{fontSize:16, fontWeight:'300',color:'#fff'}}>Registrarse</Text>
                </TouchableOpacity>
              </View>

            </View>

            
          </BlurView>

      </ScrollView>
      


    </View>
  );

}


export default function App() {
  return(
    <PantallaLogin/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagen:{
    //ESTILOS
  },
  login:{
    //Estilos login
  },
  input:{
    width:200,
    height:50,
    borderColor:'#fff',
    borderRadius:20,
    padding:15,
    backgroundColor:'green',

  },
  boton:{
    width:200,
    height:50,
    borderRadius:20,
    backgroundColor:'green',
    alignItems:'center',
    justifyContent:'center',
    borderColor:'#fff'

  }
});
