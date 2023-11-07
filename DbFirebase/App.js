//Importaciones de las dependencias
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {initializeApp} from 'firebase/app';
import {getDatabase, ref, onValue} from 'firebase/database';

const FirebaseData=()=>{
  const [productData, setProductData]=useState([]);

  useEffect(()=>{
    const firebaseconfig={
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    };

    const firebaseApp=initializeApp(firebaseconfig);
    const database=getDatabase(firebaseApp);
    const productsRef= ref(database, 'Productos');

    //Recorrido de los registros
    onValue(productsRef,(snapshot)=>{
      if(snapshot.exists()){
        //Obtencion de los datos de firebase de la rama Productos
        const data=snapshot.val();
        const productArray=[];

        //recorrido a todos los datos
        for(const key in data){
          if(data.hasOwnProperty(key)){
            const product=data[key];
            productArray.push({
              key,
              nombre:product.nombre,
              precio:product.precio,
              imagen:product.imagen,
            });
          }
        }
        setProductData(productArray);
      }
    });

  },[]);

return(
  <View style={styles.container}>
      <Text>Productos</Text>
      <View style={styles.productContainer}>
        {productData.map((product)=>(
          <View key={product.key} style={styles.productoItems}>
            <Image source={{uri:product.imagen}} style={styles.productoImagen} />
            <Text style={styles.productoNombre}>{product.nombre} </Text>
            <Text style={styles.productoPrecio}>{product.precio} Bs </Text>
          </View>
        ))}
      </View>
  </View>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent:'center',
    padding:10,
  },
  productContainer:{
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between',

  },
  productoItems:{
    width:'48%',
    marginBottom:15,
    borderWidth:1,
    borderColor:'#ccc',
    padding:10,
    borderRadius:10,
  },
  productoImagen:{
    width:'100%',
    height:120,

  },
  productoNombre:{
    fontSize:18,
    fontWeight:'bold',
    fontFamily:'Roboto',
  },
  productoPrecio:{
    fontSize:16,
  }
});

export default FirebaseData;
