//Importacion de dependencias
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView,Image } from 'react-native';
import axios from 'axios';

const App=()=>{
  const [data,setData]=useState([]);

  useEffect(()=>{
    Data();
  },[]);


const Data=async()=>{
  try{
    const response=await axios.get(
      'https://api.airtable.com/v0//Productos',
      {
        headers:{
          Authorization: `Bearer token`,
        },
      }
    );
    setData(response.data.records);
  }catch(error){
    console.error(error);
  }
};

const Card=(product)=>{
  return(
    <View key={product.id} style={styles.card}>
      <Image source={{uri:product.fields.Imagen}} style={styles.imagen} />
      <Text style={styles.nameProducto} >{product.fields.Nombre} </Text>
      <Text style={styles.precioProducto}>{product.fields.Precio} Bs </Text>
    </View>
  );
};
return(
  <View style={styles.container}>
    {
      data.length>0?(
        <ScrollView contentContainerStyle={styles.contenedorCardView} >
          {data.map((product)=>Card(product))}
        </ScrollView>
      ):(
        <Text>Cargando Productos...</Text>
      )
    }
  </View>
);
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card:{
    width:250,
    backgroundColor:'#fff',
    padding:10,
    borderRadius:10,
    marginBottom:10,

  },
  imagen:{
    width:'100%',
    height:200,
    borderRadius:10,
    marginBottom:10,

  },
  nameProducto:{
    fontSize:18,
    fontWeight:'bold',
    marginBottom:8,
  },
  precioProducto:{
    fontSize:16,
  },
  contenedorCardView:{
    justifyContent:'center',
    alignItems:'center',
    flexGrow:1,
  }
});
